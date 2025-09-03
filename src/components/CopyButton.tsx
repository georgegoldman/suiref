import React from "react";

export function CopyButton({
  value,
  className = "",
  label = "Copy Sui Address",
  copiedLabel = "Copied!",
  ms = 1200,
  disabled,
}: {
  value?: string | null;
  className?: string;
  label?: string;
  copiedLabel?: string;
  ms?: number;           // how long to show "Copied!"
  disabled?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy(text: string) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), ms);
    } catch {
      // no-op or you can surface a toast
    }
  }

  const canCopy = !!value && !disabled;

  return (
    <button
      type="button"
      onClick={() => value && copy(value)}
      disabled={!canCopy}
      title={canCopy ? "Copy to clipboard" : "Nothing to copy"}
      className={
        "inline-flex items-center gap-1 rounded-full w-fit lg:px-2 lg:py-1 p-2 text-xs " +
        "bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 " +
        className
      }
    >
      {/* tiny clipboard icon (SVG) */}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
