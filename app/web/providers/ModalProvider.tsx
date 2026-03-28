"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "../components/modal/page";

interface ModalContextType {
  openModal: (
    content: ReactNode,
    title?: string,
    showCloseButton?: boolean,
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>();
  const [showCloseButton, setShowCloseButton] = useState(true);

  function openModal(
    component: ReactNode,
    modalTitle?: string,
    showCloseButton?: boolean,
  ) {
    setShowCloseButton(showCloseButton ?? true);
    setContent(component);
    setTitle(modalTitle);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setContent(null);
    setTitle(undefined);
    setShowCloseButton(true);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {isOpen && (
        <Modal
          title={title}
          onClose={closeModal}
          showCloseButton={showCloseButton}
        >
          {content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
}
