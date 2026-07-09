"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { enforcePoppinsHtml } from "@/app/lib/html";

type LegalType = "terms" | "privacy";

type Props = {
  linkClassName?: string;
  showPrivacy?: boolean;
  agreeText?: string;
};

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
}

export default function FormLegalLinks({
  linkClassName = "text-[#0066FF] underline",
  showPrivacy = true,
  agreeText = "I agree to the",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [openType, setOpenType] = useState<LegalType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpenType(null);
    setTitle("");
    setContent("");
    setLoading(false);
  }, []);

  const openModal = useCallback(async (type: LegalType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenType(type);
    setLoading(true);
    setTitle(type === "terms" ? "Terms & Conditions" : "Privacy Policy");
    setContent("");

    try {
      const res = await fetch(`${apiBaseUrl()}/api/legal/${type}/`);
      if (!res.ok) return;
      const raw = await res.json();
      const page = Array.isArray(raw) ? raw[0] : raw;
      setTitle(
        page?.title?.trim() ||
          (type === "terms" ? "Terms & Conditions" : "Privacy Policy"),
      );
      setContent(
        page?.content?.trim() ||
          `${type === "terms" ? "Terms & Conditions" : "Privacy Policy"} content will be available soon.`,
      );
    } catch {
      setContent("Unable to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!openType) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openType, closeModal]);

  return (
    <>
      <span>
        {agreeText}{" "}
        <button
          type="button"
          onClick={(e) => openModal("terms", e)}
          className={linkClassName}
        >
          Terms & Conditions
        </button>
        {showPrivacy ? (
          <>
            {" "}
            and{" "}
            <button
              type="button"
              onClick={(e) => openModal("privacy", e)}
              className={linkClassName}
            >
              Privacy Policy
            </button>
          </>
        ) : null}
        *
      </span>

      {mounted && openType
        ? createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
              onClick={closeModal}
              role="presentation"
            >
              <div
                className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="legal-modal-title"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h2
                    id="legal-modal-title"
                    className="text-xl font-bold text-[#001f3f]"
                  >
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-[calc(85vh-72px)] overflow-y-auto px-6 py-5">
                  {loading ? (
                    <p className="text-sm text-slate-500">Loading...</p>
                  ) : (
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: enforcePoppinsHtml(content),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
