import { redirect } from "next/navigation";

/**
 * Public site has no admin UI. The admin app is a separate Next.js app.
 * Visiting /admin or /admin/dashboard here forwards to that origin so links are not 404.
 *
 * Set NEXT_PUBLIC_ADMIN_URL (e.g. http://localhost:3001) to match where `admin-frontend` runs.
 */
export default async function AdminRedirect({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const base = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001").replace(
    /\/$/,
    "",
  );
  const rest = slug?.filter(Boolean).join("/") ?? "";
  const target = rest ? `${base}/admin/${rest}` : `${base}/admin`;
  redirect(target);
}
