"use client";

import {
  useEffect,
  useRef,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;

  maxWidth?: string;

  className?: string;

  closeOnOutside?: boolean;
  closeOnEsc?: boolean;

  showOverlay?: boolean;

  padding?: string;
};

export default function BaseModal({

  open,
  onClose,
  children,

  maxWidth = "max-w-4xl",

  className = "",

  closeOnOutside = true,
  closeOnEsc = true,

  showOverlay = true,

  padding = "p-5",

}: Props) {

  const modalRef =
    useRef<HTMLDivElement>(null);

  /* =====================================================
     ESC CLOSE
  ===================================================== */

  useEffect(() => {

    if (!open || !closeOnEsc)
      return;

    function handleEsc(
      e: KeyboardEvent
    ) {

      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleEsc
      );
    };

  }, [
    open,
    onClose,
    closeOnEsc,
  ]);

  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  useEffect(() => {

    if (
      !open ||
      !closeOnOutside
    ) return;

    function handleClickOutside(
      e: MouseEvent
    ) {

      if (
        modalRef.current &&
        !modalRef.current.contains(
          e.target as Node
        )
      ) {

        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [
    open,
    onClose,
    closeOnOutside,
  ]);

  /* =====================================================
     BODY SCROLL LOCK
  ===================================================== */

  useEffect(() => {

    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {

      document.body.style.overflow =
        originalOverflow;
    };

  }, [open]);

  /* =====================================================
     RENDER
  ===================================================== */

  if (!open) return null;

  return (

    <div
      className={`
        fixed inset-0 z-50

        flex
        items-center
        justify-center

        ${padding}

        ${
          showOverlay
            ? `
              bg-black/40
              backdrop-blur-sm
            `
            : ""
        }
      `}
    >

      {/* =====================================================
          MODAL CONTAINER
      ===================================================== */}

      <div

        ref={modalRef}

        role="dialog"
        aria-modal="true"

        className={`

          relative

          w-full
          ${maxWidth}

          h-full
          max-h-[95vh]

          overflow-hidden

          bg-[#FCFCFD]

          rounded-[28px]

          border
          border-gray-200/80

          shadow-[0_10px_50px_rgba(15,23,42,0.08)]

          animate-in
          fade-in
          zoom-in-95
          duration-200

          flex
          flex-col

          ${className}

        `}
      >

        {children}

      </div>

    </div>
  );
}