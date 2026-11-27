/// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { EntityProp, RecipientTypeEnum } from "@/app/web/constants/enum";
import Button from "../../button/button";
import { i18n } from "@/app/web/constants/i18n";

const DeactiveEntity = i18n["Pt-Br"].Components.Modal.UpdateStatusEntityModal;
const { cancel, active, deactive } = i18n["Pt-Br"].Components.Modal.Generic

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
  } = DeactiveEntity[entity];

  const description = isActive ? deactivateDescription : activateDescription;

  const confirmText = isActive
    ? deactive
    : active;

  return (
    <div className="flex flex-col w-full">
      <p className="mt-2 text-sm text-gray-600">{description}</p>

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancel} onPress={onCancel} />
        <Button text={confirmText} onPress={onConfirm} />
      </div>
    </div>
  );
}
