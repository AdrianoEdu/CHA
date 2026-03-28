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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 relative">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          >
            ×
          </button>
        )}

        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        <div>{children}</div>
      </div>
    </div>
  );
}
