import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="icon"
      className="rounded-sm w-fit h-fit translate-y-0.5 ml-1 p-0.5 bg-transparent"
    >
      {copied ? (
        <ClipboardCheck className="w-1 h-1 text-xs" />
      ) : (
        <Clipboard className="w-1 h-1" />
      )}
    </Button>
  );
}
