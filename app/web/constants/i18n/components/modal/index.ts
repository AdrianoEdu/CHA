// Copyright (c) 2026-11-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export const MODAL_I18N = {
  Generic: {
    cancel: 'Cancelar',
    update: 'Atualizar',
    confirm: 'Confirmar',
    register: 'Registrar'
  },
  UpsertAccount: {
    title: {
      edit: "Editar conta corrente",
      register: "Registrar conta corrente",
    },
    messages: {
      loadBanksError: "Não foi possível carregar os bancos. Tente novamente.",
      loadAccountError: "Não foi possível carregar os dados da conta.",
      selectBank: "Selecione um banco.",
      accountNumberRequired: "Informe o número da conta.",
      invalidBalance: "Informe um saldo válido.",
    },
    fields: {
      bank: "Banco",
      accountNumber: "Número da conta",
      balance: "Saldo",
    },
    status: {
      loadingBanks: "Carregando bancos...",
    }
  },
  UpsertBank: {
    title: {
      edit: "Editar Banco",
      create: "Criar Banco",
    },
    fields: {
      name: "Nome do banco",
      agency: "Agência",
    },
  },
}