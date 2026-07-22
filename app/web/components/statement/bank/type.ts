import { FinancialFlowType } from "@/app/web/constants/enum";
import { GetBankStatementDto } from "@/app/web/dto/bank-statemenrt-dto"

export type BankStatementListProps = {
  balanceAccount: number;
  data: GetBankStatementDto[];

  onSelect: () => void;
}

export type StyleComponentProps = {
  financialFlowType: FinancialFlowType;
}