import { motion } from "framer-motion";
import { ArrowLeft, Crown, CreditCard, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const bankDetails = {
  bankName: "Bank of Baroda",
  branch: "Perinthalmanna",
  accountNumber: "42350100005252",
  ifsc: "BARBOPERINT",
  accountHolder: "Mohammed Muneeb PT",
};

const premiumFeatures = [
  "Unlimited Private Repos",
  "Full API & Architecture Docs",
  "CI/CD Webhook Sync",
  "Priority Email Support",
  "Custom Templates",
  "Mermaid Diagram Export",
  "Local File Upload Analysis",
];

const PaymentPage = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ value, field }: { value: string; field: string }) => (
    <button
      onClick={() => handleCopy(value, field)}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {copiedField === field ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="AutoDoc AI" className="w-8 h-8" />
            <span className="font-bold text-foreground">
              AutoDoc <span className="text-primary">AI</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Crown size={14} className="text-primary" />
            <span className="text-xs font-mono text-primary">PREMIUM UPGRADE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Upgrade to <span className="text-gradient-primary">Pro</span>
          </h1>
          <p className="text-muted-foreground">₹999/month · Unlock unlimited documentation generation</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Crown size={18} className="text-primary" />
              Pro Features
            </h2>
            <ul className="space-y-3">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                  <Check size={16} className="text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Bank Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-primary/30 bg-card p-6 glow-border"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              Bank Transfer Details
            </h2>
            <div className="space-y-4">
              {[
                { label: "Bank Name", value: bankDetails.bankName },
                { label: "Branch", value: bankDetails.branch },
                { label: "Account Number", value: bankDetails.accountNumber },
                { label: "IFSC Code", value: bankDetails.ifsc },
                { label: "Account Holder", value: bankDetails.accountHolder },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-mono text-foreground font-medium">{value}</p>
                  </div>
                  <CopyButton value={value} field={label} />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                After payment, send the transaction receipt to{" "}
                <a href="mailto:mohammedmuneebptcsa@gmail.com" className="text-primary hover:underline">
                  mohammedmuneebptcsa@gmail.com
                </a>{" "}
                for activation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
