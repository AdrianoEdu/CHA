export const ENUM_I18N = {
  RecurringPaymentDateType: {
    FIXED_DAY: "Dia fixo",
    BIWEEKLY: "Quinzenal",
    FIFTH_BUSINESS_DAY: "Quinto dia útil",
    THIRTEENTH_SALARY: "Décimo terceiro salário",
    VACATION: 'Férias'
  },
  BusinessDayAdjustment: {
    NONE: "Nenhum",
    NEXT_BUSINESS_DAY: "Próximo dia útil",
    PREVIOUS_BUSINESS_DAY: "Dia útil anterior",
  },
} as const;