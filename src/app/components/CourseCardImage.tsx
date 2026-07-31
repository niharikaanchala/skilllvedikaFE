type Props = {
  src?: string | null;
  alt: string;
  fallbackGradient?: string;
  className?: string;
};

/**
 * Fixed aspect media area so course cards align.
 * Uses object-contain so the full image is visible (no crop).
 */
export default function CourseCardImage({
  src,
  alt,
  fallbackGradient = "from-[#0f2744] to-[#2b5a9e]",
  className = "",
}: Props) {
  return (
    <div
      className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-white ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain object-center transition duration-300 group-hover:opacity-95"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br px-4 text-center ${fallbackGradient}`}
        >
          <span className="line-clamp-3 text-sm font-semibold text-white/90">{alt}</span>
        </div>
      )}
    </div>
  );
}
