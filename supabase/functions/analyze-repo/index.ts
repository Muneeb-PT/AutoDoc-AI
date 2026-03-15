import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repo_url: rawUrl } = await req.json();
    if (!rawUrl || typeof rawUrl !== "string") {
      return new Response(
        JSON.stringify({ error: "repo_url is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize: trim whitespace, remove trailing slashes/".git"
    let repo_url = rawUrl.trim().replace(/\/+$/, "").replace(/\.git$/, "");
    // Add https:// if missing
    if (/^(github\.com|gitlab\.com|bitbucket\.org)/i.test(repo_url)) {
      repo_url = "https://" + repo_url;
    }

    // Validate it looks like a GitHub URL
    const urlPattern = /^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org)\/.+\/.+/i;
    if (!urlPattern.test(repo_url)) {
      console.error("URL validation failed for:", repo_url);
      return new Response(
        JSON.stringify({ error: "Please provide a valid GitHub, GitLab, or Bitbucket repository URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create the job
    const { data: job, error: insertError } = await supabase
      .from("analysis_jobs")
      .insert({ repo_url, status: "processing" })
      .select()
      .single();

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    // Extract repo name for context
    const repoName = repo_url.split("/").slice(-2).join("/");

    // Call Lovable AI to generate documentation
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are AutoDoc AI, a Senior Software Architect and Documentation Expert. 
You generate world-class, comprehensive documentation for code repositories.

When given a repository URL, generate a complete README.md that includes:
1. **Project Overview** - What the project does, its purpose and value proposition
2. **Architecture** - High-level system architecture with component descriptions
3. **Installation** - Step-by-step setup instructions
4. **Usage** - Code examples and API reference
5. **Architecture Diagram** - A Mermaid.js flowchart showing the system architecture
6. **Configuration** - Environment variables and configuration options
7. **Contributing** - Guidelines for contributors
8. **License** - Standard license section

Use proper Markdown formatting. Make the documentation professional, detailed, and production-ready.
Include realistic Mermaid.js diagrams using \`\`\`mermaid code blocks.
Base your documentation on the repository name and common patterns for that type of project.`,
          },
          {
            role: "user",
            content: `Generate comprehensive documentation for this repository: ${repo_url}

Repository: ${repoName}

Please create a complete, production-ready README.md with all sections including architecture diagrams in Mermaid.js format.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        await supabase
          .from("analysis_jobs")
          .update({ status: "failed", error_message: "Rate limit exceeded. Please try again later." })
          .eq("id", job.id);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later.", job_id: job.id }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        await supabase
          .from("analysis_jobs")
          .update({ status: "failed", error_message: "AI credits exhausted." })
          .eq("id", job.id);
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds.", job_id: job.id }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const markdown = aiData.choices?.[0]?.message?.content || "Documentation generation failed.";

    // Update job with result
    await supabase
      .from("analysis_jobs")
      .update({ status: "completed", result_markdown: markdown })
      .eq("id", job.id);

    return new Response(
      JSON.stringify({ job_id: job.id, status: "completed", result: markdown }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-repo error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
