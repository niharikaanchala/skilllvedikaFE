/** Format Django date string (YYYY-MM-DD) for display */
export function formatBlogDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function blogArticleMeta(post: {
  author: string;
  date: string;
  read_time: string;
}): string {
  return `${post.author} · ${formatBlogDate(post.date)} · ${post.read_time}`;
}
