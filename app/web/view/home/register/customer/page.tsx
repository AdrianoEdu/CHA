// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UpsertCustomer } from "@/app/web/components/modal/upsert-customer/page";
import Table from "@/app/web/components/table/page";
import { ActionEnum } from "@/app/web/constants/enum";
import {
  CreateCustomerDto,
  GetCustomerDto,
  UpdateCustomerDto,
} from "@/app/web/dto/customer.dto";
import { useModal } from "@/app/web/providers/ModalProvider";
import { customerService } from "@/app/web/services/customerService/customerService";
import { handleGenericFilter } from "@/app/web/utils/filters";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

let oldCustomerList: GetCustomerDto[] = [];

export default function Customer() {
  const [filter, setFilter] = useState("");
  const [customerList, setCustomerList] = useState<GetCustomerDto[]>([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { closeModal, openModal } = useModal();

  useEffect(() => {
    handleGetAllCustomers();
  }, []);

  useEffect(() => {
    handleFilterCustomerName();
  }, [filter]);

  const hanleOpenModalRegisterCustomer = (): void => {
    openModal(
      <UpsertCustomer
        onClose={closeModal}
        onRegister={handleRegisterCustomer}
      />,
      "Registrar Cliente",
    );
  };

  const handleGetAllCustomers = async (): Promise<void> => {
    const result = await customerService.findAll({
      skip: 0,
      take: 20,
      type: ActionEnum.FindAll,
    });

    oldCustomerList = result;
    setCustomerList(result);
  };

  const handleRegisterCustomer = async (
    data: CreateCustomerDto,
  ): Promise<void> => {
    await customerService.create(data).then(() => {
      toast.success("Cliente registrado com sucesso");
      handleGetAllCustomers();
      closeModal();
    });
  };

  const handleUpdateCustomer = async (
    data: UpdateCustomerDto,
  ): Promise<void> => {
    await customerService.update(data).then(() => {
      toast.success("Cliente Atualizado com sucesso");
      handleGetAllCustomers();
      closeModal();
    });
  };

  const handleFilterCustomerName = async () => {
    await handleGenericFilter({
      originalList: oldCustomerList,
      filter,
      setList: setCustomerList,
      getSearchField: (emp) => emp.name,
      fetchFromApi: async (value) => {
        return customerService.findByName({
          name: value,
          type: ActionEnum.FindByName,
        });
      },
    });
  };

  const handleSetFilterCustomerName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilter(name);
    }, 500);
  };

  const handleOpenModalEditCustomer = (row: UpdateCustomerDto): void => {
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

  return (
    <div>
      <Table
        enableFilter
        title={"Clientes"}
        rows={customerList}
        onRowClick={handleOpenModalEditCustomer}
        onFilterChange={handleSetFilterCustomerName}
        onActionClicked={hanleOpenModalRegisterCustomer}
        columns={[
          { label: "Criado em", accessor: "createdAt" },
          { label: "Nome do cliente", accessor: "name" },
          { label: "CNPJ", accessor: "code" },
          {
            label: "Tipo",
            accessor: "customerType",
            render: (row) =>
              row.customerType === "CLIENT" ? "Cliente" : "Fornecedor",
          },
        ]}
      />
    </div>
  );
}
