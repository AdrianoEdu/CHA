// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "../../button/page";
import { i18n } from "@/app/web/constants/i18n";

const { cancelButton, registerButton, UpdateStatusEmployee } =
  i18n["Pt-Br"].Modal;

const {
  activateTitle,
  deactivateTitle,
  activateDescription,
  deactivateDescription,
  confirmActivateButton,
  confirmDeactivateButton,
} = UpdateStatusEmployee;

export type ToggleEmployeeStatusModalProps = {
  isActive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function UpdateStatusEmployeeModal({
  onCancel,
  onConfirm,
  isActive = false,
}: Readonly<ToggleEmployeeStatusModalProps>) {
  const title = isActive ? deactivateTitle : activateTitle;

  const description = isActive ? deactivateDescription : activateDescription;

  const confirmText = isActive
    ? confirmDeactivateButton
    : confirmActivateButton;

  return (
    <div className="flex flex-col w-full">
      <p className="mt-2 text-sm text-gray-600">{description}</p>

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onCancel} />
        <Button text={confirmText} onPress={onConfirm} />
      </div>
    </div>
  );
}
