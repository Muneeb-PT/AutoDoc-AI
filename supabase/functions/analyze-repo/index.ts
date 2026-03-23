import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type DocType = "readme" | "resume" | "report" | "proposal" | "api-docs";

const systemPrompts: Record<DocType, string> = {
  readme: `You are AutoDoc AI, a Senior Software Architect and Documentation Expert.
Generate a complete, production-ready README.md that includes:
1. **Project Overview** - What the project does, its purpose and value proposition
2. **Architecture** - High-level system architecture with component descriptions
3. **Installation** - Step-by-step setup instructions
4. **Usage** - Code examples and API reference
5. **Architecture Diagram** - A Mermaid.js flowchart showing the system architecture
6. **Configuration** - Environment variables and configuration options
7. **Contributing** - Guidelines for contributors
8. **License** - Standard license section
Use proper Markdown formatting. Include realistic Mermaid.js diagrams using \`\`\`mermaid code blocks.`,

  resume: `You are AutoDoc AI, a Professional Resume Writer.
Generate a polished, ATS-friendly resume in Markdown format. Include:
1. **Header** - Name, title, contact info
2. **Professional Summary** - 3-4 sentence overview
3. **Skills** - Categorized technical and soft skills
4. **Experience** - Work history with bullet points and metrics
5. **Education** - Degrees and certifications
6. **Projects** - Notable projects with descriptions
Format professionally with clean Markdown. Use bullet points and quantified achievements.`,

  report: `You are AutoDoc AI, a Business Report Specialist.
Generate a structured professional report in Markdown format. Include:
1. **Executive Summary** - Key findings and recommendations
2. **Introduction** - Background and objectives
3. **Methodology** - Approach and data sources
4. **Findings** - Detailed analysis with sub-sections
5. **Data Visualization** - Mermaid.js charts (pie, bar, flowchart) where appropriate
6. **Recommendations** - Actionable next steps
7. **Conclusion** - Summary of key points
8. **Appendix** - Supporting details
Use professional tone. Include Mermaid.js diagrams using \`\`\`mermaid code blocks.`,

  proposal: `You are AutoDoc AI, a Business Proposal Expert.
Generate a compelling business proposal in Markdown format. Include:
1. **Cover Page** - Title, date, company
2. **Executive Summary** - Problem and proposed solution
3. **Problem Statement** - Detailed challenge description
4. **Proposed Solution** - Technical/business approach
5. **Scope & Deliverables** - What will be delivered
6. **Timeline** - Mermaid.js Gantt chart for project phases
7. **Budget** - Cost breakdown table
8. **Team** - Key personnel and qualifications
9. **Terms & Conditions** - Standard terms
Use persuasive professional tone. Include Mermaid.js diagrams.`,

  "api-docs": `You are AutoDoc AI, an API Documentation Expert.
Generate comprehensive API documentation in Markdown format. Include:
1. **Overview** - API purpose and base URL
2. **Authentication** - Auth methods and examples
3. **Endpoints** - Detailed endpoint documentation with:
   - Method and path
   - Request parameters/body
   - Response format
   - Code examples (curl, JavaScript)
4. **Error Codes** - Common errors and solutions
5. **Rate Limiting** - Usage limits
6. **SDKs** - Available client libraries
7. **Architecture** - Mermaid.js sequence diagram for request flow
Use proper Markdown with tables and code blocks.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      repo_url: rawUrl,
      file_content,
      project_name,
      doc_type = "readme",
      language = "English",
      key_points = "",
      topic = "",
      user_name = "",
    } = body;

    const isFileMode = !!file_content;
    const docType = (doc_type as DocType) || "readme";

    if (!isFileMode && !rawUrl && !topic) {
      return new Response(
        JSON.stringify({ error: "Please provide a URL, files, or topic" }),
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

    let repoName = project_name || topic || "Project";
    let repoUrl = "";

    if (!isFileMode && rawUrl) {
      repoUrl = rawUrl.trim().replace(/\/+$/, "").replace(/\.git$/, "");
      if (!/^https?:\/\//i.test(repoUrl)) {
        repoUrl = "https://" + repoUrl;
      }
      try {
        new URL(repoUrl);
      } catch {
        return new Response(
          JSON.stringify({ error: "Please provide a valid URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      repoName = repoUrl.split("/").filter(Boolean).slice(-2).join("/");
    }

    // Get auth user from request
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const { data: job, error: insertError } = await supabase
      .from("analysis_jobs")
      .insert({
        repo_url: repoUrl || `local://${repoName}`,
        status: "processing",
        user_id: userId,
      })
      .select()
      .single();

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    // Build user prompt
    let userContent = "";
    if (isFileMode) {
      userContent = `Generate documentation for this project named "${repoName}".
Files:\n${file_content.substring(0, 50000)}`;
    } else if (rawUrl) {
      userContent = `Generate documentation for: ${repoUrl}\nRepository: ${repoName}`;
    } else {
      userContent = `Generate a ${docType} document about: ${topic}`;
    }

    if (user_name) userContent += `\nAuthor/Person: ${user_name}`;
    if (key_points) userContent += `\nKey points to include:\n${key_points}`;

    const langInstruction = language !== "English"
      ? `\n\nIMPORTANT: Generate the ENTIRE document in ${language}. All headings, content, and descriptions must be in ${language}.`
      : "";

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompts[docType] + langInstruction },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        await supabase.from("analysis_jobs").update({ status: "failed", error_message: "Rate limit exceeded." }).eq("id", job.id);
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        await supabase.from("analysis_jobs").update({ status: "failed", error_message: "AI credits exhausted." }).eq("id", job.id);
        return new Response(JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const markdown = aiData.choices?.[0]?.message?.content || "Documentation generation failed.";

    await supabase.from("analysis_jobs").update({ status: "completed", result_markdown: markdown }).eq("id", job.id);

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
