// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Modal from "@/app/web/components/modal/page";
import Table from "@/app/web/components/table/page";
import { access } from "fs";
import { useState } from "react";

export default function EmployeeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Meu Modal"
      >
        <p>Conteúdo do modal aqui.</p>
      </Modal>
      <h1 className="text-2xl font-bold">Funcionários</h1>
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
        onActionClicked={() => setIsModalOpen(true)}
      />
    </div>
  );
}
