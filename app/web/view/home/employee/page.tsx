// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Button from "@/app/web/components/button/page";
import Modal from "@/app/web/components/modal/page";
import RegisterUser from "@/app/web/components/modal/register-user/page";
import Table from "@/app/web/components/table/page";
import { EmployeeDto } from "@/app/web/dto/employee.dto";
import { EnableIcon } from "@/app/web/icons";
import DisableIcon from "@/app/web/icons/disable-icon";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EmployeeScreen() {
  const [employeeList, setEmployeeList] = useState<EmployeeDto[]>([]);

  const { openModal, closeModal } = useModal();

  const handleRegisterUser = async (name: string): Promise<void> => {
    employeeService.create({ name }).then(() => {
      closeModal();
      toast.success("Usuário criado com sucesso");
      handleFindEmployees();
    });
  };

  const handleOpenRegisterUserModal = (): void => {
    openModal(
      <RegisterUser onClose={closeModal} onRegister={handleRegisterUser} />,
      "Registrar Funcionário",
    );
  };

  const handleOpenDeactiveUserModal = (): void => {
    openModal(<></>, "Desativar Funcionário");
  };

  const handleOpenActiveUserModal = (): void => {
    openModal(<></>, "Ativar Funcionário");
  };

  const handleFindEmployees = async (): Promise<void> => {
    const result = await employeeService.findAll({ skip: 0, take: 20 });
    setEmployeeList(result);
  };

  useEffect(() => {
    handleFindEmployees();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Funcionários</h1>
      <Table
        title="Tabela de funcionários"
        columns={[
          { label: "Criado em", accessor: "createdAt" },
          { label: "Nome", accessor: "name" },
          {
            label: "Ativo",
            render: (row) => (row.isActive ? "Sim" : "Não"),
          },
          {
            label: "Ações",
            isAction: true,
            render: (row) =>
              row.isActive ? (
                <Button
                  className="bg-red-500"
                  icon={<DisableIcon />}
                  onClick={handleOpenDeactiveUserModal}
                />
              ) : (
                <Button
                  className="bg-green-500"
                  icon={<EnableIcon />}
                  onClick={handleOpenActiveUserModal}
                />
              ),
          },
        ]}
        rows={employeeList}
        onActionClicked={handleOpenRegisterUserModal}
      />
    </div>
  );
}
