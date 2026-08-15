// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React from "react";

interface ModalProps {
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
}

export default function Modal({
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div
        className="
          relative
          w-fit
          min-w-[500px]
          max-w-[calc(100vw-2rem)]
          max-h-[calc(100vh-2rem)]
          rounded-xl
          bg-white
          p-6
          shadow-lg
          overflow-auto
        "
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 font-bold text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        )}

        {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}

        <div>{children}</div>
      </div>
    </div>
  );
}
