/**
 * Canonical public site origin used for sitemap, robots, and absolute SEO URLs.
 * Always HTTPS in production so reverse-proxy (HTTP → Node) never leaks http:// locs.
 */
export const CANONICAL_SITE_URL = "https://skillvedika.com";

function isLocalHostName(host: string): boolean {
  const normalized = host.toLowerCase().split(":")[0]?.trim() ?? "";
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "[::1]"
  );
}

function firstHeaderValue(value: string | null): string {
  if (!value) return "";
  return value.split(",")[0]?.trim() ?? "";
}

/**
 * Normalize any origin/host string to a clean origin (no trailing slash).
 * Non-local hosts are always upgraded to https.
 */
export function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return CANONICAL_SITE_URL;

  try {
    const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withScheme);
    const host = parsed.hostname.toLowerCase();

    if (isLocalHostName(host)) {
      return parsed.origin.replace(/\/$/, "");
    }

    // Keep sitemap/robots aligned with site canonicals (non-www + https).
    if (host === "skillvedika.com" || host === "www.skillvedika.com") {
      return CANONICAL_SITE_URL;
    }

    parsed.protocol = "https:";
    return parsed.origin.replace(/\/$/, "");
  } catch {
    return CANONICAL_SITE_URL;
  }
}

type OriginRequestLike = {
  headers: {
    get(name: string): string | null;
  };
  nextUrl?: {
    origin?: string;
    hostname?: string;
    host?: string;
  };
};

/**
 * Resolve the public site origin for sitemap / robots.
 * Prefers env, then forwarded host, then request host — always HTTPS off localhost.
 */
export function resolveSiteOrigin(request?: OriginRequestLike): string {
  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();
  if (envSiteUrl) {
    return normalizeSiteOrigin(envSiteUrl);
  }

  if (!request) {
    return CANONICAL_SITE_URL;
  }

  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const hostHeader = firstHeaderValue(request.headers.get("host"));
  const requestHost =
    forwardedHost ||
    hostHeader ||
    request.nextUrl?.host ||
    request.nextUrl?.hostname ||
    "";

  if (requestHost && !isLocalHostName(requestHost)) {
    return normalizeSiteOrigin(requestHost);
  }

  // Localhost / missing host: keep production absolute URLs for SEO tooling.
  return CANONICAL_SITE_URL;
}

export function absoluteSiteUrl(path: string, origin = CANONICAL_SITE_URL): string {
  const cleanOrigin = origin.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanOrigin}${cleanPath}`;
}
