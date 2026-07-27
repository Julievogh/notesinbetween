"use client";

import { useEffect, useState } from "react";

type ArticlePhotoProps = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ArticlePhoto({ src, alt, caption }: ArticlePhotoProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block w-full cursor-zoom-in text-left"
        aria-label="Open image"
      >
        <div className="relative overflow-hidden border border-black/20 bg-neutral-200">
          <img
            src={src}
            alt={alt}
            className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />

          <div className="tape pointer-events-none absolute left-1/2 top-[-8px] h-8 w-24 -translate-x-1/2 rotate-2" />
        </div>

        {caption && (
          <p className="text-muted mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em]">{caption}</p>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded article image"
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 font-mono text-xs uppercase tracking-widest text-white"
          >
            Close ×
          </button>

          <figure
            className="paper max-h-[90vh] max-w-[900px] rotate-[-0.5deg] p-3 pb-12 shadow-2xl sm:p-5 sm:pb-16"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={src} alt={alt} className="max-h-[72vh] w-auto max-w-full object-contain" />

            <figcaption className="mt-5 text-center font-serif text-lg italic text-neutral-700">
              {caption ?? alt}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
