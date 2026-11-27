// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { UserRole } from "@/app/generated/prisma";
import Button from "@/app/web/components/button/button";
import RemoveModal from "@/app/web/components/modal/remove-employee/remove-employee";
import UpsertCustomerModal from "@/app/web/components/modal/upsert-customer/usert-customer";
("@/app/web/components/modal/upsert-customer/usert-customer");
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
import { maskPhone } from "@/app/web/utils/customer/customer";
import UpdateStatusEntityModal from "@/app/web/components/modal/update-status-entity/update-status-entity";
import { EntityProp } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";

let countCustomers = 0;
let oldCustomerList: GetCustomerDto[] = [];

const { activateTitle, deactivateTitle } = i18n["Pt-Br"].Components.Modal.UpdateStatusEntityModal.customer;
const { Title } = i18n["Pt-Br"].Components.Modal.UpsertCustomer;
const { Table: TableKey, messages } = i18n["Pt-Br"].Screen.CustomerScreen;

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
      <UpsertCustomerModal
        onClose={closeModal}
        onRegister={handleRegisterCustomer}
      />,
      Title.registerCustomer,
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
    try {
      await customerService.create(data);

      toast.success(messages.createSuccess);
    } catch (error) {
      toast.error(messages.createError);
    }
    finally {
      await handleGetAllCustomers(currentPage);
      closeModal()
    }
  };

  const handleUpdateCustomer = async (
    data: UpdateCustomerDto,
  ): Promise<void> => {
    try {
      await customerService.update(data);

      toast.success(messages.updateSucess);
    } catch (error) {
      toast.error(messages.updateError);
    }
    finally {
      await handleGetAllCustomers(currentPage);
      closeModal()
    }
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
      <UpsertCustomerModal
        data={row}
        onClose={closeModal}
        onUpdated={handleUpdateCustomer}
        onRegister={handleRegisterCustomer}
      />,
      Title.udpateCustomer,
    );
  };

  const handleRemoveCustomer = (customerId: string): void => {
    customerService.delete(customerId).then(() => {
      closeModal();
      handleGetAllCustomers(currentPage);
      toast.success(status ? activateTitle : deactivateTitle);
    });
  };

  const handleOpenModalRemove = (
    e: React.MouseEvent,
    status: boolean,
    employeeId: string,
  ): void => {
    e.stopPropagation();

    const remove = (): void => handleRemoveCustomer(employeeId);

    openModal(
      <UpdateStatusEntityModal
        onConfirm={remove}
        isActive={status}
        onCancel={closeModal}
        entity={EntityProp.Customer}
      />,
      status ? deactivateTitle : activateTitle,
    );
  };

  const getColumns = (): TableColumn<GetCustomerDto>[] => {
    const columns: TableColumn<GetCustomerDto>[] = [
      { label: TableKey.columns.identification, accessor: "numberId" },
      { label: TableKey.columns.createdAt, accessor: "createdAt" },
      { label: TableKey.columns.customerName, accessor: "name" },
      { label: TableKey.columns.phone, render: (row) => maskPhone(row.phone ?? "") },
      { label: TableKey.columns.address, accessor: "address" },
      { label: TableKey.columns.email, accessor: "email" },
      { label: TableKey.columns.cnpj, accessor: "code" },
      {
        label: TableKey.columns.active,
        accessor: "isActive",
        render: (row) => (row.isActive ? "Sim" : "Não"),
      },
    ];

    if (isAdmin)
      columns.push({
        label: TableKey.columns.actions,
        render: (row) => {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                icon={row.isActive ? <DisabledIcon /> : <EnableIcon />}
                className={row.isActive ? "bg-red-500" : "bg-green-500"}
                onClick={(e) => handleOpenModalRemove(e, row.isActive, row.id)}
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
        rows={customerList}
        take={takeCustomers}
        title={TableKey.title}
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
