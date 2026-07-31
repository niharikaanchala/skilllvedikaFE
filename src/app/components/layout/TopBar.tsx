export type TopBarLink = {
  label: string;
  url: string;
};

export type TopBarData = {
  enabled: boolean;
  phone: string;
  email: string;
  links: TopBarLink[];
};

type Props = {
  data: TopBarData;
};

function normalizeLinks(links: unknown): TopBarLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const label = String(row.label ?? row.text ?? "").trim();
      const url = String(row.url ?? row.link ?? "").trim();
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((item): item is TopBarLink => item != null);
}

export function parseTopBarFromSettings(
  settings: Array<Record<string, unknown>>,
): TopBarData | null {
  const row = settings.find((s) => s && typeof s === "object") ?? null;
  if (!row) return null;

  const enabled = row.top_bar_enabled !== false;
  const phone = String(row.top_bar_phone ?? "").trim();
  const email = String(row.top_bar_email ?? "").trim();
  const links = normalizeLinks(row.top_bar_links);

  if (!enabled) return null;
  if (!phone && !email && links.length === 0) return null;

  return { enabled: true, phone, email, links };
}

export default function TopBar({ data }: Props) {
  const phoneHref = data.phone
    ? `tel:${data.phone.replace(/[^\d+]/g, "")}`
    : "";
  const emailHref = data.email ? `mailto:${data.email}` : "";

  return (
    <div className="w-full bg-[#0a0a0a] text-white">
      <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-4 overflow-x-auto whitespace-nowrap px-4 text-[11px] sm:text-xs md:px-8">
        <div className="flex items-center">
          {data.links.map((link, index) => (
            <span key={`${link.label}-${index}`} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mx-2 text-white/40" aria-hidden>
                  |
                </span>
              ) : null}
              <a
                href={link.url}
                className="text-white/90 transition hover:text-white"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-white/90">
          {data.phone ? (
            <a href={phoneHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{data.phone}</span>
            </a>
          ) : null}
          {data.email ? (
            <a href={emailHref} className="inline-flex items-center gap-1.5 transition hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6l-10 7L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{data.email}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
