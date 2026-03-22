// Copyright (c) 2026-03-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { i18n } from "@/app/web/constants/i18n";
import {
  CreateAdvanceReasonDto,
  UpdateAdavanceReasonDto,
} from "@/app/web/dto/advance-reason.dto";
import { useEffect, useState } from "react";
import Input from "../../input/page";
import { Regex } from "@/app/web/constants/regex";
import Button from "../../button/page";

type AdvanceReasonProps = {
  data?: UpdateAdavanceReasonDto;
  onClose: () => void;
  onUpdated?: (data: UpdateAdavanceReasonDto) => void;
  onRegister?: (data: CreateAdvanceReasonDto) => void;
};

const { cancelButton, registerButton, updateButton } = i18n["Pt-Br"].Modal;

export function UpsertAdvanceReason({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<AdvanceReasonProps>) {
  const [name, setName] = useState("");
  const [showErrorRegex, setShowErrorRegex] = useState(false);

  useEffect(() => {
    if (!data) return;

    setName(data.name!);
  }, [data]);

  const handleUpsertAdvanceReason = (): void => {
    if (onUpdated) {
      onUpdated({ id: data?.id!, name });
      return;
    }

    if (onRegister) onRegister({ name });
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        regex={Regex.onlyText}
        regexError={showErrorRegex}
        onRegexError={setShowErrorRegex}
        name={"Infome o motivo o adiantamento"}
        onChange={(e) => setName(e.target.value)}
        regexMessageError={
          "Por favor informar caracteres válidos (apenas texto)"
        }
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          disabled={showErrorRegex}
          onPress={handleUpsertAdvanceReason}
          text={!data ? registerButton : updateButton}
        />
      </div>
    </div>
  );
}
