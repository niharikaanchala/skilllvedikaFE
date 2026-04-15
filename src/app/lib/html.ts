export function enforcePoppinsHtml(input: string | null | undefined): string {
  const html = String(input ?? "");
  if (!html) return "";

  // Remove inline font-family declarations (including quoted families and `!important`).
  // Example removed values:
  // - font-family: Poppins
  // - font-family: "Times New Roman", serif !important
  let cleaned = html.replace(/font-family\s*:\s*[^;]+;?/gi, "");

  // Normalize style attributes after removal.
  cleaned = cleaned.replace(/\sstyle="([^"]*)"/gi, (_m, styleValue: string) => {
    const normalized = styleValue
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join("; ");
    return normalized ? ` style="${normalized}"` : "";
  });
  cleaned = cleaned.replace(/\sstyle='([^']*)'/gi, (_m, styleValue: string) => {
    const normalized = styleValue
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join("; ");
    return normalized ? ` style='${normalized}'` : "";
  });

  return cleaned;
}
