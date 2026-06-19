// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import { UpsertCustomer } from "@/upsert-customer/page";
import Table, { TableColumn } from "@/app/web/components/table/table";
import {
  CreateCustomerDto,
  GetCustomerDto,
  UpdateCustomerDto,
} from "@/app/web/dto/customer.dto";
import { DisabledIcon, EnableIcon } from "@/app/web/icons";
import { useAuth } from "@/app/web/providers/AuthProvider";
import { useModal } from "@/app/web/providers/ModalProvider";
import { customerService } from "@/app/web/services/customerService/customerService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "@/app/web/icons/edit-icon";

let countCustomers = 0;
let oldCustomerList: GetCustomerDto[] = [];

const takeCustomers = 20;

export default function Customer() {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerList, setCustomerList] = useState<GetCustomerDto[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { closeModal, openModal } = useModal();

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (filter) {
      handleFilterCustomerName(currentPage);
      return;
    }

    handleGetAllCustomers(currentPage);
  }, [currentPage, filter]);

  const currentCountCustomers = useMemo(() => {
    return countCustomers;
  }, [countCustomers]);

  const hanleOpenModalRegisterCustomer = (): void => {
    openModal(
      <UpsertCustomer
        onClose={closeModal}
        onRegister={handleRegisterCustomer}
      />,
      "Registrar Cliente",
    );
  };

  const handleGetAllCustomers = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeCustomers;

    const { count, customers } = await customerService.findAll({
      all: true,
      skip: currentSkip,
      take: takeCustomers,
      orderBy: { name: "asc" },
    });

    countCustomers = count;
    setCustomerList(customers);
    oldCustomerList = customers;
  };

  const handleRegisterCustomer = async (
    data: CreateCustomerDto,
  ): Promise<void> => {
    await customerService.create(data).then(() => {
      toast.success("Cliente registrado com sucesso");
      handleGetAllCustomers(currentPage);
      closeModal();
    });
  };

  const handleUpdateCustomer = async (
    data: UpdateCustomerDto,
  ): Promise<void> => {
    await customerService.update(data).then(() => {
      toast.success("Cliente Atualizado com sucesso");
      handleGetAllCustomers(currentPage);
      closeModal();
    });
  };

  const handleFilterCustomerName = async (page: number) => {
    const currentSkip = (page - 1) * takeCustomers;

    await handleGenericFilter({
      filter,
      originalList: oldCustomerList,
      setList: setCustomerList,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        // @ts-ignore
        const filteredFields: Partial<GetCustomerDto> = Number.isNaN(parsed)
          ? { name: { contains: value, mode: "insensitive" } }
          : { numberId: parsed };

        const { count, customers } = await customerService.findAll({
          skip: currentSkip,
          all: true,
          take: takeCustomers,
          where: filteredFields,
        });

        countCustomers = count;

        return { count, data: customers };
      },
    });
  };

  const handleSetFilterCustomerName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (name === "") setCurrentPage(1);

      setFilter(name);
    }, 500);
  };

  const handleOpenModalEditCustomer = (
    e: React.MouseEvent,
    row: UpdateCustomerDto,
  ): void => {
    e.stopPropagation();

    openModal(
      <UpsertCustomer
        data={row}
        onClose={closeModal}
        onUpdated={handleUpdateCustomer}
        onRegister={handleRegisterCustomer}
      />,
      "Editar Cliente",
    );
  };

  const handleRemoveCustomer = (customerId: string): void => {
    customerService.delete(customerId).then(() => {
      closeModal();
      toast.success("Cliente removido com sucesso");
      handleGetAllCustomers(currentPage);
    });
  };

  const handleOpenModalRemove = (
    e: React.MouseEvent,
    customerId: string,
  ): void => {
    e.stopPropagation();

    const remove = (): void => handleRemoveCustomer(customerId);

    openModal(<RemoveModal onClose={closeModal} onConfirm={remove} />);
  };

  const getColumns = (): TableColumn<GetCustomerDto>[] => {
    const columns: TableColumn<GetCustomerDto>[] = [
      { label: "Identificação", accessor: "numberId" },
      { label: "Criado em", accessor: "createdAt" },
      { label: "Nome do cliente", accessor: "name" },
      { label: "CNPJ", accessor: "code" },
      {
        label: "Tipo",
        accessor: "customerType",
        render: (row) =>
          row.customerType === "CLIENT" ? "Cliente" : "Fornecedor",
      },
      {
        label: "Ativo?",
        accessor: "isActive",
        render: (row) => (row.isActive ? "Sim" : "Não"),
      },
    ];

    if (isAdmin)
      columns.push({
        label: "Ações",
        render: (row) => {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                onClick={(e) => handleOpenModalRemove(e, row.id)}
                icon={row.isActive ? <DisabledIcon /> : <EnableIcon />}
                className={row.isActive ? "bg-red-500" : "bg-green-500"}
              />

              {row.isActive && (
                <Button
                  icon={<EditIcon />}
                  className={"bg-green-500"}
                  onClick={(e) => handleOpenModalEditCustomer(e, row)}
                />
              )}
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
        title={"Clientes"}
        rows={customerList}
        take={takeCustomers}
        columns={getColumns()}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        countRows={currentCountCustomers}
        onFilterChange={handleSetFilterCustomerName}
        onActionClicked={hanleOpenModalRegisterCustomer}
      />
    </div>
  );
}
