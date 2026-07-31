/** True when HTML has visible text (ignores empty tags like `<p></p>`). */
export function hasMeaningfulHtml(input: string | null | undefined): boolean {
  const html = String(input ?? "");
  if (!html.trim()) return false;
  const text = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

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

export function linkifyPlainUrlsInHtml(input: string | null | undefined): string {
  const html = String(input ?? "");
  if (!html) return "";

  // Split by tags and only replace URLs in text nodes.
  const parts = html.split(/(<[^>]+>)/g);
  const urlRegex = /((?:https?:\/\/|www\.)[^\s<]+)/gi;

  return parts
    .map((part) => {
      if (!part || part.startsWith("<")) return part;

      return part.replace(urlRegex, (rawUrl: string) => {
        const href = rawUrl.startsWith("www.") ? `https://${rawUrl}` : rawUrl;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${rawUrl}</a>`;
      });
    })
    .join("");
}

function mergeInlineStyle(existingAttrs: string, styleToAdd: string): string {
  const styleAttrRegex = /\sstyle\s*=\s*["']([^"']*)["']/i;
  const match = existingAttrs.match(styleAttrRegex);
  if (!match) {
    return `${existingAttrs} style="${styleToAdd}"`;
  }

  const existingStyle = match[1].trim();
  const mergedStyle = existingStyle ? `${existingStyle}; ${styleToAdd}` : styleToAdd;
  return existingAttrs.replace(styleAttrRegex, ` style="${mergedStyle}"`);
}

export function enforceHeadingSizesInHtml(input: string | null | undefined): string {
  const html = String(input ?? "");
  if (!html) return "";

  return html
    .replace(/<h1([^>]*)>/gi, (_m, attrs: string) =>
      `<h1${mergeInlineStyle(attrs, "font-size: 32px; line-height: 1.25; font-weight: 700;")}>`,
    )
    .replace(/<h2([^>]*)>/gi, (_m, attrs: string) =>
      `<h2${mergeInlineStyle(attrs, "font-size: 24px; line-height: 1.35; font-weight: 600;")}>`,
    )
    .replace(/<h3([^>]*)>/gi, (_m, attrs: string) =>
      `<h3${mergeInlineStyle(attrs, "font-size: 20px; line-height: 1.4; font-weight: 600;")}>`,
    )
    .replace(/<h4([^>]*)>/gi, (_m, attrs: string) =>
      `<h4${mergeInlineStyle(attrs, "font-size: 18px; line-height: 1.45; font-weight: 600;")}>`,
    );
}
