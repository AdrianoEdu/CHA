// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/page";
import RegisterEmployeeModal from "@/app/web/components/modal/register-employee/page";
import RemoveModal from "@/app/web/components/modal/remove-employee/page";
import UpdateStatusEmployeeModal from "@/app/web/components/modal/update-status-employee/page";
import Table, { TableColumn } from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { EmployeeDto } from "@/app/web/dto/employee.dto";
import { DeleteIcon, EnableIcon } from "@/app/web/icons";
import DisableIcon from "@/app/web/icons/disable-icon";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { handleGenericFilter } from "@/app/web/utils/filters";
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

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    handleFindEmployees();
  }, []);

  useEffect(() => {
    handleFilterEmployeeName();
  }, [filter]);

  const handleNavigateEmployeeAdvancedScreen = (row: EmployeeDto) => {
    router.push(
      `/web/view/home/register/employee/advanced/${row.id}/${row.name}`,
    );
  };

  const handleRegisterEmployee = async (name: string): Promise<void> => {
    employeeService.create({ name }).then(() => {
      toast.success(RegisterEmployee.successRegisterEmployee);
      handleFindEmployees();
      closeModal();
    });
  };

  const handleUpdateStatusEmployee = async (
    status?: boolean,
    employeeId?: string,
  ): Promise<void> => {
    employeeService.patch({ isActive: !status, id: employeeId }).then(() => {
      toast.success(
        status
          ? UpdateStatusEmployee.successDeactiveEmployee
          : UpdateStatusEmployee.successActiveEmployee,
      );
      closeModal();
    });
  };

  const handleRemoverEmployee = async (id?: string): Promise<void> => {
    employeeService.delete(id ?? "").then(() => {
      toast.success(RemoveEmployee.successRemoveEmployee);
      closeModal();
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

  const handleOpenRemoveEmployeeModal = (
    e: React.MouseEvent,
    employeeId?: string,
  ): void => {
    e.stopPropagation();

    const remove = (): void => {
      handleRemoverEmployee(employeeId);
    };

    openModal(
      <RemoveModal onClose={closeModal} onConfirm={remove} />,
      RemoveEmployee.title,
    );
  };

  const handleOpenStatusEmployeeModal = (
    e: React.MouseEvent,
    status?: boolean,
    employeeId?: string,
  ): void => {
    e.stopPropagation();
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

  const handleFilterEmployeeName = async () => {
    await handleGenericFilter({
      originalList: oldEmployeeList,
      filter,
      setList: setEmployeeList,
      getSearchField: (emp) => emp.name,
      fetchFromApi: async (value) => {
        return employeeService.findByName({
          name: value,
          type: ActionEnum.FindByName,
        });
      },
    });
  };

  const handleSetFilterEmployeeName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter(name);
    }, 500);
  };

  const getColumns = (): TableColumn<EmployeeDto>[] => {
    const columns: TableColumn<EmployeeDto>[] = [
      { label: "Criado em", accessor: "createdAt" },
      { label: "Nome", accessor: "name" },
      {
        label: "Ativo",
        render: (row) => (row.isActive ? "Sim" : "Não"),
      },
    ];

    if (isAdmin)
      columns.push({
        label: "Ações",
        isAction: true,
        render: (row) => {
          return (
            <div className="flex gap-2 justify-center">
              {row.isActive ? (
                <Button
                  className="bg-red-500"
                  icon={<DisableIcon />}
                  onClick={(e) =>
                    handleOpenStatusEmployeeModal(e, row.isActive, row.id)
                  }
                />
              ) : (
                <Button
                  className="bg-green-500"
                  icon={<EnableIcon />}
                  onClick={(e) =>
                    handleOpenStatusEmployeeModal(e, row.isActive, row.id)
                  }
                />
              )}

              <Button
                className="bg-red-500"
                icon={<DeleteIcon />}
                onClick={(e) => handleOpenRemoveEmployeeModal(e, row.id)}
              />
            </div>
          );
        },
      });

    return columns;
  };

  return (
    <div>
      <Table
        enableFilter
        rows={employeeList}
        title={"Funcionários"}
        columns={getColumns()}
        onFilterChange={handleSetFilterEmployeeName}
        onRowClick={handleNavigateEmployeeAdvancedScreen}
        onActionClicked={handleOpenRegisterEmployeeModal}
      />
    </div>
  );
}
