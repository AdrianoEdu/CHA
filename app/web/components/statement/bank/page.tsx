import { JSX, memo } from "react";
import { List } from "../list/page";
import { BankStatementListProps, StyleComponentProps } from "./type";
import { FinancialFlowType } from "@/app/web/constants/enum";
import { IncomeIcon } from "@/app/web/icons/in-icon";
import { ExpenseIcon } from "@/app/web/icons/out-icon";

let currentValueByMovement = 0;

const GetIcon = ({ financialFlowType }: StyleComponentProps): JSX.Element => {
  if (financialFlowType === FinancialFlowType.IN)
    return <IncomeIcon />

  return <ExpenseIcon />
}

const getColor = (financialFlowType: FinancialFlowType): string => {
  if (financialFlowType === FinancialFlowType.IN) return 'green';

  return 'red';
}



const getStatusValue = (financialFlowType: FinancialFlowType, value: string): string => {
  if (financialFlowType === FinancialFlowType.IN) return `+ R$ ${value}`;

  return `- R$ ${value}`;
}

const getCurrentValueByMovement = (value: number): string => {
  const currentBankStatement = currentValueByMovement;

  currentValueByMovement = currentBankStatement - value;

  return `R$ ${Math.abs(currentBankStatement).toFixed(2)}`;
}

const BankStatementComponent = ({ data, balanceAccount, onSelect }: BankStatementListProps): JSX.Element => {
  currentValueByMovement = balanceAccount;

  return (
    <List title="Extrato">
      {data.map(({ createdAt, financalCategory, value, id, title, description }) => (
        <div
          key={id}
          onClick={onSelect}
          className=" flex items-center justify-between px-6 py-5 border-b hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex gap-4 items-center">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center bg-${getColor(financalCategory.financialFlowType)}-100`}
            >
              <GetIcon financialFlowType={financalCategory.financialFlowType} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {title}
              </p>

              <p className="text-sm text-slate-500">{description}</p>

              <p className="text-xs text-slate-400 mt-1">
                {createdAt.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p
              className={`text-xl font-bold text-${getColor(financalCategory.financialFlowType)}-600`}
            >
              {getStatusValue(financalCategory.financialFlowType, Math.abs(value).toFixed(2))}
            </p>

            <p className="text-sm text-slate-500">
              {`Saldo provisório: R$ ${getCurrentValueByMovement(value)}`}
            </p>
          </div>
        </div>
      ))}
    </List>
  );
}

export const BankStatementList = memo(BankStatementComponent)