"use client";

import CounsellingModal from "@/app/course/[id]/CounsellingModal";

type Props = {
  whatsappHref: string;
};

/** Support-advisor avatar with headset — chat-widget style */
function SupportAgentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft long-shadow like chat widgets */}
      <ellipse cx="36" cy="42" rx="14" ry="16" fill="rgba(0,0,0,0.12)" />

      {/* Shoulders / white top */}
      <path
        d="M12 64c2.5-14 11-22 20-22s17.5 8 20 22H12z"
        fill="#F5F7FA"
      />
      <path
        d="M28 44c1.8 3.2 3.4 4.8 4 4.8s2.2-1.6 4-4.8c-2.6-1-5.4-1-8 0z"
        fill="#E8ECF2"
      />

      {/* Neck */}
      <rect x="28.5" y="36" width="7" height="8" rx="2" fill="#E8B892" />

      {/* Head */}
      <circle cx="32" cy="28" r="11.5" fill="#E8B892" />

      {/* Hair bob */}
      <path
        d="M20.5 28c0-10 5.2-16.5 11.5-16.5S43.5 18 43.5 28c0 1.2-.2 2.3-.5 3.3-.8-5.2-3.8-8.8-7.5-9.6-1.2-.3-2.4-.2-3.5.2-4.2 1.4-7.2 5.8-8 10.8-.8-1.2-1.5-2.8-1.5-4.7z"
        fill="#5C3A2E"
      />
      <path
        d="M21 30.5c.6 4.2 2.4 7.2 4.8 8.2-.4-2.2-.5-4.6-.2-7.1C23.8 31.2 22.2 30.6 21 30.5z"
        fill="#5C3A2E"
      />
      <path
        d="M43 30.5c-1.2.1-2.8.7-4.6 1.1.3 2.5.2 4.9-.2 7.1 2.4-1 4.2-4 4.8-8.2z"
        fill="#5C3A2E"
      />

      {/* Headset band */}
      <path
        d="M21 27.5c1.2-8.5 5.8-13 11-13s9.8 4.5 11 13"
        fill="none"
        stroke="#2F3640"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Ear cups */}
      <rect x="17.2" y="25" width="5.2" height="9" rx="2.4" fill="#2F3640" />
      <rect x="41.6" y="25" width="5.2" height="9" rx="2.4" fill="#2F3640" />
      <rect x="18.2" y="26.2" width="3.2" height="6.6" rx="1.5" fill="#4A5563" />
      <rect x="42.6" y="26.2" width="3.2" height="6.6" rx="1.5" fill="#4A5563" />

      {/* Mic boom */}
      <path
        d="M22.5 32.5c-1.5 2.8-1.2 6.2 1.2 8.2 1.4 1.2 3.2 1.6 4.8 1.2"
        fill="none"
        stroke="#2F3640"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="29.2" cy="41.4" r="2.1" fill="#2F3640" />
      <circle cx="29.2" cy="41.4" r="1.1" fill="#6B7280" />
    </svg>
  );
}

export default function FloatingContactButtons({ whatsappHref }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      <CounsellingModal
        buttonText="Talk to Advisor"
        modalTitle="Talk to"
        modalTitleHighlight="Advisor"
        modalSubtitle="Share your details and our advisor will connect with you shortly."
        leadSource="Talk to Advisor"
        className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#4a90e2] to-[#2b6cb0] shadow-[0_10px_24px_-8px_rgba(31,79,150,0.85)] ring-2 ring-white transition hover:from-[#5a9eeb] hover:to-[#2f74bc] animate-bounce"
      >
        <span className="sr-only">Talk to Advisor</span>
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
        <SupportAgentIcon className="relative h-full w-full scale-110" />
      </CounsellingModal>

      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-8px_rgba(37,211,102,0.75)] ring-2 ring-white transition hover:bg-[#1ebe57] animate-bounce"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
            <path d="M19.11 17.53c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z" />
            <path d="M16.02 3C9.39 3 4 8.38 4 15.02c0 2.12.55 4.1 1.52 5.83L4 29l8.32-1.49A11.95 11.95 0 0 0 16.02 27C22.66 27 28 21.62 28 14.98 28 8.38 22.66 3 16.02 3zm0 21.82c-1.9 0-3.67-.5-5.21-1.38l-.37-.22-4.94.89.93-4.81-.24-.39A9.78 9.78 0 0 1 6.2 15.02c0-5.42 4.41-9.82 9.82-9.82s9.82 4.4 9.82 9.82-4.41 9.8-9.82 9.8z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
