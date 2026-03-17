// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/page";
import RegisterEmployeeModal from "@/app/web/components/modal/register-employee/page";
import RemoveEmployeeModal from "@/app/web/components/modal/remove-employee/page";
import UpdateStatusEmployeeModal from "@/app/web/components/modal/update-status-employee/page";
import Table from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { EmployeeDto } from "@/app/web/dto/employee.dto";
import { DeleteIcon, EnableIcon } from "@/app/web/icons";
import DisableIcon from "@/app/web/icons/disable-icon";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const { RegisterEmployee, UpdateStatusEmployee, RemoveEmployee } =
  i18n["Pt-Br"].Modal;

let oldEmployeeList: EmployeeDto[] = [];

export default function EmployeeScreen() {
  const [employeeList, setEmployeeList] = useState<EmployeeDto[]>([]);
  const [filter, setFilter] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { openModal, closeModal } = useModal();
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigateEmployeeAdvancedScreen = (row: EmployeeDto) => {
    router.push(`/web/view/home/employee/advanced/${row.id}/${row.name}`);
  };

  const handleRegisterEmployee = async (name: string): Promise<void> => {
    employeeService.create({ name }).then(() => {
      closeModal();
      toast.success(RegisterEmployee.successRegisterEmployee);
      handleFindEmployees();
    });
  };

  const handleUpdateStatusEmployee = async (
    status?: boolean,
    employeeId?: string,
  ): Promise<void> => {
    employeeService.patch({ isActive: !status, id: employeeId }).then(() => {
      closeModal();
      toast.success(
        status
          ? UpdateStatusEmployee.successDeactiveEmployee
          : UpdateStatusEmployee.successActiveEmployee,
      );
    });
  };

  const handleRemoverEmployee = async (id?: string): Promise<void> => {
    employeeService.delete(id ?? "").then(() => {
      closeModal();
      toast.success(RemoveEmployee.successRemoveEmployee);
    });
  };

  const handleOpenRegisterEmployeeModal = (): void => {
    openModal(
      <RegisterEmployeeModal
        onClose={closeModal}
        onRegister={handleRegisterEmployee}
      />,
      RegisterEmployee.title,
    );
  };

  const handleOpenRemoveEmployeeModal = (employeeId?: string): void => {
    openModal(
      <RemoveEmployeeModal
        onClose={closeModal}
        onConfirm={() => handleRemoverEmployee(employeeId)}
      />,
      RemoveEmployee.title,
    );
  };

  const handleOpenStatusEmployeeModal = (
    status?: boolean,
    employeeId?: string,
  ): void => {
    openModal(
      <UpdateStatusEmployeeModal
        isActive={status}
        onCancel={closeModal}
        onConfirm={() => handleUpdateStatusEmployee(status, employeeId)}
      />,
      status
        ? UpdateStatusEmployee.deactivateTitle
        : UpdateStatusEmployee.activateTitle,
    );
  };

  const handleFindEmployees = async (): Promise<void> => {
    const result = await employeeService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    oldEmployeeList = result;
    setEmployeeList(result);
  };

  const handleSetFilterEmployeeName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter(name);
    }, 500);
  };

  const handleFilterEmployeeName = async (): Promise<void> => {
    if (filter === "") {
      setEmployeeList(oldEmployeeList);
      return;
    }

    const local = oldEmployeeList.filter((emp) =>
      emp.name.toLowerCase().includes(filter),
    );

    if (local.length > 0) {
      setEmployeeList(local);
      return;
    }

    try {
      const apiResult = await employeeService.findByName({
        name: filter,
        type: ActionEnum.FindByName,
      });

      if (!apiResult || apiResult.length === 0) {
        setEmployeeList([]);
        return;
      }

      setEmployeeList(apiResult);
    } catch (error) {
      console.error(error);
      setEmployeeList(oldEmployeeList);
    }
  };

  useEffect(() => {
    handleFindEmployees();
  }, []);

  useEffect(() => {
    handleFilterEmployeeName();
  }, [filter]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Funcionários</h1>
      <Table
        enableFilter
        rows={employeeList}
        title="Tabela de funcionários"
        onFilterChange={handleSetFilterEmployeeName}
        onRowClick={handleNavigateEmployeeAdvancedScreen}
        onActionClicked={handleOpenRegisterEmployeeModal}
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
            render: (row) => {
              const isAdmin = user?.role === UserRole.ADMIN;

              return (
                <div className="flex gap-2 justify-center">
                  {row.isActive ? (
                    <Button
                      className="bg-red-500"
                      icon={<DisableIcon />}
                      onClick={() =>
                        handleOpenStatusEmployeeModal(row.isActive, row.id)
                      }
                    />
                  ) : (
                    <Button
                      className="bg-green-500"
                      icon={<EnableIcon />}
                      onClick={() =>
                        handleOpenStatusEmployeeModal(row.isActive, row.id)
                      }
                    />
                  )}

                  {isAdmin && (
                    <Button
                      className="bg-gray-700"
                      icon={<DeleteIcon />}
                      onClick={() => handleOpenRemoveEmployeeModal(row.id)}
                    />
                  )}
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}
