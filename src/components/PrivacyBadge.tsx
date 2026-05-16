import { Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyBadgeProps {
  type: "client" | "server";
  className?: string;
}

export const PrivacyBadge = ({ type, className }: PrivacyBadgeProps) => {
  if (type === "client") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          "bg-success/10 text-success border border-success/20",
          className
        )}
        title="Processed locally — file never leaves your device"
      >
        <Shield className="h-3.5 w-3.5" />
        <span>Client-side</span>
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-destructive/10 text-destructive border border-destructive/20",
        className
      )}
      title="Requires upload — explicit consent required"
    >
      <Lock className="h-3.5 w-3.5" />
      <span>Server required</span>
    </div>
  );
};
