// Copyright (c) 2026-11-23
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Eduardo Trentin Junior.
// All rights reserved.

import Button from '@/app/web/components/button/button';
import UpsertRecurringPaymentModal from '@/app/web/components/modal/upsert-recurring-payment/upsert-recurring-payment';
import Table, { TableColumn } from '@/app/web/components/table/table';
import { RecurringPaymentDateType } from '@/app/web/constants/enum';
import { i18n } from '@/app/web/constants/i18n';
import { CreateRecurringPaymentDto, GetRecurringPaymentDto, UpdateRecurringPaymentDto } from '@/app/web/dto/recurring-payment'
import { DeleteIcon } from '@/app/web/icons';
import EditIcon from '@/app/web/icons/edit-icon';
import { useModal } from '@/app/web/providers/ModalProvider';
import { recurringPaymentService } from '@/app/web/services/recurringPaymentService/recurringPaymentService';
import { handleGenericFilter } from '@/app/web/utils/filters';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';

type ComplementaryProps = {
  employeeId: string;
}

type GetColumProps = {
  remove: (mouseEvent: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  edit: (mouseEvent: React.MouseEvent<HTMLButtonElement>, data: GetRecurringPaymentDto) => void;
}

const getColumns = ({ edit, remove }: GetColumProps): TableColumn<GetRecurringPaymentDto>[] => {
  return [
    { label: 'Criado em', accessor: "createdAt" },
    { label: 'Motivo', accessor: "name" },
    {
      label: 'Tipo de vencimento', render(row) {
        return i18n['Pt-Br'].ENUM_I18N.RecurringPaymentDateType[row.dueDateType]
      },
    },
    {
      label: 'Ações',
      render(row) {
        return (
          <div className="flex flex-row gap-2">
            <Button
              icon={<DeleteIcon />}
              className="bg-red-500"
              onClick={(e) => remove(e, row.id)}
            />
            <Button
              icon={<EditIcon />}
              className="bg-green-500"
              onClick={(e) => edit(e, row)}
            />
          </div>
        );
      },
    },
  ];
};

let countRecurringPayment = 0;
const takeRecurringPayment = 20;

let oldRecurringPaymentlist: GetRecurringPaymentDto[] = [];

export default function Complementary({ employeeId }: Readonly<ComplementaryProps>): JSX.Element {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeRecurringPayment, setEmployeeRecurringPayment] = useState<GetRecurringPaymentDto[]>();

  const { openModal, closeModal } = useModal();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (filter) {
      handleFilterRecurringPayment(currentPage);
      return;
    }

    handleFindRecurringPayment(currentPage);
  }, [currentPage, filter]);

  const currentCountRecurringPayment = useMemo(() => {
    return countRecurringPayment;
  }, [countRecurringPayment]);

  const handleFindRecurringPayment = async (page: number): Promise<void> => {
    const currentSkip = (page - 1) * takeRecurringPayment;

    const { recurringPayment, count } = await recurringPaymentService.findAll({
      all: true,
      skip: currentSkip,
      take: takeRecurringPayment,
      orderBy: { createdAt: "desc" },
    });

    setEmployeeRecurringPayment(recurringPayment);
    oldRecurringPaymentlist = recurringPayment;

    countRecurringPayment = count;
  };

  const handleFilterRecurringPayment = async (page: number) => {
    const currentSkip = (page - 1) * takeRecurringPayment;

    await handleGenericFilter({
      originalList: oldRecurringPaymentlist,
      filter,
      setList: setEmployeeRecurringPayment,
      fetchFromApi: async (value) => {
        const parsed = Number(value);

        // @ts-ignore
        const filteredFields: Partial<GetRecurringPaymentDto> = Number.isNaN(parsed)
          ? { name: { contains: value, mode: "insensitive" } }
          : { agencies: [Number(value)] };// avaliar esse cara

        const { count, recurringPayment } = await recurringPaymentService.findAll({
          all: true,
          take: takeRecurringPayment,
          skip: currentSkip,
          where: filteredFields,
        });

        countRecurringPayment = count;

        return { count, data: recurringPayment };
      },
    });
  };

  const handleOpenModalRemoveRecurringPayment = async (mouseEvent: React.MouseEvent<HTMLButtonElement>, id: string): Promise<void> => {
    if (mouseEvent) mouseEvent.stopPropagation();
  }

  const handleOpenModalEditRecurringPayment = async (mouseEvent: React.MouseEvent<HTMLButtonElement>, data: GetRecurringPaymentDto): Promise<void> => {
    handleOpenModalRecurringPayment(mouseEvent, data);
  }

  const handleOpenModalRecurringPayment = (
    mouseEvent?: React.MouseEvent<HTMLButtonElement>,
    data?: GetRecurringPaymentDto
  ): void => {
    if (mouseEvent) mouseEvent.stopPropagation();

    openModal(
      <UpsertRecurringPaymentModal
        data={data}
        onEdit={handleEdit}
        onClose={closeModal}
        employeeId={employeeId}
        onRegister={handleRegister}
      />
    );
  };

  const handleEdit = async (data: UpdateRecurringPaymentDto): Promise<void> => {
    try {
      await recurringPaymentService.update(data);
      toast.success('Conta programada atualizada com sucesso')
    } catch (error) {
      toast.error('Não foi possível atualizar conta programada, tente novamente')
    }
    finally {
      handleFindRecurringPayment(1);
      closeModal();
    }
  }

  const handleRegister = async (data: CreateRecurringPaymentDto): Promise<void> => {
    try {
      await recurringPaymentService.create(data);
      toast.success('Conta programada registrada com sucesso')
    } catch (error) {
      toast.error('Não foi possível registrar conta programada, tente novamente')
    }
    finally {
      handleFindRecurringPayment(1);
      closeModal();
    }
  }

  const handleSetFilterName = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (name === "") setCurrentPage(1);
      setFilter(name);
    }, 500);
  };

  return <div className="flex flex-col">
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold">
        Informações complementares
      </h2>

      <p className="text-sm text-gray-500">
        Gerencie configurações adicionais vinculadas ao funcionário.
      </p>
    </div>

    <Table
      currentPage={currentPage}
      rows={employeeRecurringPayment}
      title={'Transações programadas'}
      onFilterChange={handleSetFilterName}
      columns={getColumns({
        edit: handleOpenModalEditRecurringPayment,
        remove: handleOpenModalRemoveRecurringPayment
      })}
      onActionClicked={handleOpenModalRecurringPayment}
    />
  </div>
}