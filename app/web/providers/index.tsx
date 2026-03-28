"use client";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./AuthProvider";
import { ModalProvider } from "./ModalProvider";

export function WebProviders({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <AuthProvider>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </ModalProvider>
  );
}
