// Copyright (c) 2026-11-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export const MODAL_I18N = {
  Generic: {
    remove: 'Remover',
    cancel: 'Cancelar',
    update: 'Atualizar',
    confirm: 'Confirmar',
    register: 'Registrar',
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
  EmployeeAdvanced: {
    Register: {
      title: "Registrar adiantamento",
      inputNamePlaceholder: "Informe o motivo do adiantamento",
      inputAmountPlaceholder: "Informe valor do adiantamento",
      errorEmptyName: "Por favor, informe o motivo do adiantamento.",
      errorInvalidName:
        "Por favor, insira somente caracteres válidos (apenas letras).",
      successRegisterEmployeeAdvance: "Adiantamento registrado com sucesso!",
    },
  },
  RemoveModal: {
    titleRemove: "Confirmação de exclusão",
    descriptionRemove:
      "Tem certeza de que deseja remover este registro? Esta ação não poderá ser desfeita.",
  },
  UpsertFinancialEntryModal: {
    fields: {
      titleStatement: "Descrição do extrato",
      descriptionStatement: "Observações",
      category: "Selecione a categoria do extrato",
      value: "Valor",
      notes: 'Observações',
      customer: 'Recebido por',
    },
    messages: {
      loadCategoriesError:
        "Não foi possível carregar as categorias financeiras. Tente novamente.",
      loadingCategories: "Carregando categorias...",
      requiredTitle: "Informe a descrição do lançamento.",
      requiredCategory: "Selecione uma categoria financeira.",
      invalidValue: "Informe um valor válido.",
    },
  },
  UpsertFinancialCategory: {
    editTitle: "Editar uma categoria financeira",
    registerTitle: "Registrar categoria financeira",
  },
  UpsertCustomer: {
    fields: {
      email: "E-mail",
      phone: "Telefone",
      labelCPF: "Informe o CPF",
      labelCNPJ: "Informe o CNPJ",
      address: "Informe o endereço",
      name: "Informe o nome do cliente",
      toggleLegalEntity: "Pessoa jurídica?",
      identification: "Informe a identificação do cliente",
    },
    regex: {
      error: {
        identificationRegexOnlyNumbers:
          "Por favor informar caracteres válidos (apenas números)",
        phoneRegex: "Informe número válido.",
        generic: "Por favor informar caracteres válidos",
        email: 'Informe um e-mail válido'
      },
    },
  }
}