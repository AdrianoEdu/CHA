// Copyright (c) 2026-03-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RegisterEmployeeModal from "@/app/web/components/modal/register-employee/register-employee";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import UpdateStatusEmployeeModal from "@/app/web/components/modal/update-status-employee/update-status-employee";
import Table, { TableColumn } from "@/app/web/components/table/table";
import { i18n } from "@/app/web/constants/i18n";
import { EmployeeDto } from "@/app/web/dto/employee.dto";
import { DeleteIcon, EnableIcon } from "@/app/web/icons";
import DisableIcon from "@/app/web/icons/disable-icon";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { parse } from "next/dist/build/swc/generated-native";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const { RegisterEmployee, UpdateStatusEmployee, RemoveEmployee } =
  i18n["Pt-Br"].Modal;

let countEmployee = 0;
let oldEmployeeList: EmployeeDto[] = [];

const takeEmployee = 20;

export default function EmployeeScreen() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeList, setEmployeeList] = useState<EmployeeDto[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (filter) {
      handleFilterEmployeeName(currentPage);
      return;
    }

    handleFindEmployees(currentPage);
  }, [currentPage, filter]);

  const currentCountEmployee = useMemo(() => {
    return countEmployee;
  }, [countEmployee]);

  const handleNavigateEmployeeAdvancedScreen = (row: EmployeeDto) => {
    router.push(`/web/view/home/employee/advanced/${row.id}/${row.name}`);
  };

  const handleRegisterEmployee = async (name: string): Promise<void> => {
    employeeService.create({ name }).then(() => {
      toast.success(RegisterEmployee.successRegisterEmployee);
      handleFindEmployees(currentPage);
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
      handleFindEmployees(currentPage);
      closeModal();
    });
  };

  const handleRemoverEmployee = async (id?: string): Promise<void> => {
    employeeService.delete(id ?? "").then(() => {
      toast.success(RemoveEmployee.successRemoveEmployee);
      handleFindEmployees(currentPage);
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

  const handleFindEmployees = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeEmployee;

    const { count, employee } = await employeeService.findAll({
      all: true,
      skip: currentSkip,
      take: takeEmployee,
      orderBy: { created: "desc" },
    });

    countEmployee = count;
    setEmployeeList(employee);
    oldEmployeeList = employee;
  };

  const handleFilterEmployeeName = async (page: number) => {
    const currentSkip = (page - 1) * takeEmployee;

    await handleGenericFilter({
      filter,
      setList: setEmployeeList,
      originalList: oldEmployeeList,
      fetchFromApi: async (value) => {
        const { count, employee } = await employeeService.findAll({
          all: true,
          skip: currentSkip,
          take: takeEmployee,
          where: { name: value },
          orderBy: { createdAt: "desc" },
        });

        countEmployee = count;

        return { count, data: employee };
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
        take={takeEmployee}
        title={"Funcionários"}
        columns={getColumns()}
        currentPage={currentPage}
        countRows={currentCountEmployee}
        onFilterChange={handleSetFilterEmployeeName}
        onPageChange={(page) => setCurrentPage(page)}
        onRowClick={handleNavigateEmployeeAdvancedScreen}
        onActionClicked={handleOpenRegisterEmployeeModal}
      />
    </div>
  );
}
