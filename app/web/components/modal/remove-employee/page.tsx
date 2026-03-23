// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "../../button/page";
import { i18n } from "@/app/web/constants/i18n";

const { removeButton, cancelButton, titleRemove, descriptionRemove } =
  i18n["Pt-Br"].Modal;

export type RemoveEmployeeModalContentProps = {
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function RemoveModal({
  onClose,
  onConfirm,
}: Readonly<RemoveEmployeeModalContentProps>) {
  return (
    <div className="flex flex-col w-full">
      <p className="text-sm font-medium">{titleRemove}</p>

      <p className="text-sm text-gray-600 mt-2">{descriptionRemove}</p>

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />

        <Button
          text={removeButton}
          onPress={onConfirm}
          className={"bg-red-500"}
        />
      </div>
    </div>
  );
}
