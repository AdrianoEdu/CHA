// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Modal from "@/app/web/components/modal/page";
import RegisterUser from "@/app/web/components/modal/register-user/page";
import Table from "@/app/web/components/table/page";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { access } from "fs";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EmployeeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  const handleRegisterUser = async (name: string): Promise<void> => {
    employeeService.create({ name }).then(() => {
      closeModal();
      toast.success("Usuário criado com sucesso");
    });
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Registrar Funcionário"
      >
        <RegisterUser onClose={closeModal} onRegister={handleRegisterUser} />
      </Modal>
      /<h1 className="text-2xl font-bold">Funcionários</h1>
      <Table
        title="Tabela de funcionários"
        columns={[
          { key: "id", label: "#" },
          { key: "name", label: "Nome" },
          { key: "active", label: "Ativo no sistema?" },
          { key: "createdAt", label: "Criado em" },
          { key: "actions", label: "Ações", isAction: true },
        ]}
        rows={[
          {
            id: "1",
            name: "AdrianoEduardo",
            active: true ? "Sim" : "Não",
            createdAt: new Date().toDateString(),
          },
        ]}
        onActionClicked={openModal}
      />
    </div>
  );
}
