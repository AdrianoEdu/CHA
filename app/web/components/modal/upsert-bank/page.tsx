"use client";

import React, { useState } from "react";
import Input, { InputType } from "../../input/page";
import Button, { ButtonStatusEnum } from "../../button/page";
import { AddIcon, DeleteIcon } from "@/app/web/icons";
import { BankDto } from "@/app/web/dto/bank.dto";

interface BankModalProps {
  data?: BankDto;
  isEdit?: boolean;
  onClose: () => void;
  onSubmit: (data: BankDto, isEdit?: boolean) => void;
}

export default function BankModal({
  data,
  onClose,
  onSubmit,
  isEdit = false,
}: BankModalProps) {
  const [name, setName] = useState(data?.name ?? "");
  const [agencyInput, setAgencyInput] = useState("");
  const [agencies, setAgencies] = useState<string[]>(data?.agencies ?? []);

  function handleAddAgency() {
    if (!agencyInput) return;

    if (!agencies.includes(agencyInput)) {
      setAgencies([...agencies, agencyInput]);
    }

    setAgencyInput("");
  }

  function handleRemoveAgency(agency: string) {
    setAgencies(agencies.filter((a) => a !== agency));
  }

  function handleSubmit() {
    onSubmit(
      {
        name,
        agencies,
        id: data?.id ?? "",
        createdAt: data?.createdAt ?? new Date(),
      },
      isEdit,
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-125 p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Editar Banco" : "Criar Banco"}
        </h2>

        <Input
          name="Nome do banco"
          value={name}
          disabled={isEdit}
          onChange={(e: any) => setName(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <div>
            <Input
              name="Agência"
              value={agencyInput}
              inputType={InputType.Number}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || Number(value) >= 0) {
                  setAgencyInput(value);
                }
              }}
            />
          </div>

          <Button
            icon={<AddIcon />}
            onClick={handleAddAgency}
            className="h-10.5 px-3 flex items-center justify-center"
            status={isEdit ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE}
          />
        </div>

        {agencies.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4">
            {agencies.map((agency) => (
              <div
                key={agency}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm"
              >
                <span>{agency}</span>

                <Button
                  icon={<DeleteIcon />}
                  className={"px-2 py-1"}
                  status={ButtonStatusEnum.CANCEL}
                  onClick={() => handleRemoveAgency(agency)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            text="Cancelar"
            onClick={onClose}
            status={ButtonStatusEnum.CANCEL}
          />

          <Button
            onClick={handleSubmit}
            className={"px-4 py-2"}
            text={isEdit ? "Atualizar" : "Criar"}
            status={isEdit ? ButtonStatusEnum.UPDATE : ButtonStatusEnum.CONFIRM}
          />
        </div>
      </div>
    </div>
  );
}
