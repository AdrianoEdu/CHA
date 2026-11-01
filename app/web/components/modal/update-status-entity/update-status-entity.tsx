/// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { EntityProp, RecipientTypeEnum } from "@/app/web/constants/enum";
import Button from "../../button/button";
import { i18n } from "@/app/web/constants/i18n";

const { cancelButton, registerButton, DeactiveEntity } = i18n["Pt-Br"].Modal;

export type UpdateStatusEntityModalProps = {
  entity: EntityProp;
  isActive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function UpdateStatusEntityModal({
  entity,
  isActive = false,
  onCancel,
  onConfirm,
}: Readonly<UpdateStatusEntityModalProps>) {
  const {
    activateDescription,
    deactivateDescription,
    confirmActivateButton,
    confirmDeactivateButton,
  } = DeactiveEntity[entity];

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
