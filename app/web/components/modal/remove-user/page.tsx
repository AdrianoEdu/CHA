// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "../../button/page";
import { i18n } from "@/app/web/constants/i18n";

const { cancelButton, confirmButton, description, message, successRemoveUser } =
  i18n["Pt-Br"].Modal.RemoveUser;

export type RemoveUserModalContentProps = {
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
};

export default function RemoveUserModal({
  onConfirm,
  onClose,
}: Readonly<RemoveUserModalContentProps>) {
  return (
    <div className="flex flex-col w-full">
      <p className="text-sm font-medium">{message}</p>

      <p className="text-sm text-gray-600 mt-2">{description}</p>

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />

        <Button
          className="bg-red-500"
          text={confirmButton}
          onPress={onConfirm}
        />
      </div>
    </div>
  );
}
