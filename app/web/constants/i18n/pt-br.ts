// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.


const UPSERT_ACCOUNT_MODAL_TEXT = {
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
  buttons: {
    cancel: "Cancelar",
    update: "Atualizar",
    confirm: "Confirmar",
  },
  status: {
    loadingBanks: "Carregando bancos...",
  },
};

export const PtBr = {
  Screen: {
    Login: {
      Input: {
        labelUser: "Informe seu usuário",
        labelPassword: "Informe a sua senha",
      },
      Toast: {
        authError: "Erro ao autenticar usuário",
        authSuccess: "Usuário autenticado com sucesso",
        systemDownError: "Sistema fora do Ar, tente novamente mais tarde",
      },
    },
  },
  Modal: {
    UpsertAccount: { ...UPSERT_ACCOUNT_MODAL_TEXT },
    UpsertBankStatement: {
      registerTitle: "Registrar extrato",
      updateTitle: "Atualizar extrato",
    },
    UpsertCashBook: {
      registerTitle: "Registrar livro caixa",
      updateTitle: "Atualizar livro caixa",
    },
    UpsertEmployee: {
      updateTitle: "Atualizar functionário",
      registerTitle: "Registrar funcionário",
      inputNamePlaceholder: "Informe o nome do funcionário",
      errorEmptyName: "Por favor, informe o nome do funcionário.",
      errorInvalidName: "Por favor, informe um nome válido (apenas letras).",
      successRegisterEmployee: "Funcionário registrado com sucesso",
      successUpdateEmployee: "Funcionário atualizado com sucesso",
    },
    RegisterEmployeeAdvanced: {
      title: "Registrar adiantamento",
      inputNamePlaceholder: "Informe o motivo do adiantamento",
      inputAmountPlaceholder: "Informe valor do adiantamento",
      errorEmptyName: "Por favor, informe o motivo do adiantamento.",
      errorInvalidName:
        "Por favor, insira somente caracteres válidos (apenas letras).",
      successRegisterEmployeeAdvance: "Adiantamento registrado com sucesso!",
    },
    DeactiveEntity: {
      employee: {
        activateTitle: "Habilitar funcionário",
        deactivateTitle: "Desativar funcionário",
        activateDescription:
          "Tem certeza que deseja ativar este funcionário? Ele poderá acessar o sistema novamente.",
        deactivateDescription:
          "Tem certeza que deseja desativar este funcionário? Ele não poderá acessar o sistema enquanto estiver desativado.",
        confirmActivateButton: "Ativar",
        confirmDeactivateButton: "Desativar",
        successActive: "O funcionário foi ativado com sucesso.",
        successDeactive: "O funcionário foi desativado com sucesso.",
      },
      customer: {
        activateTitle: "Habilitar cliente",
        deactivateTitle: "Desativar cliente",
        activateDescription:
          "Tem certeza que deseja ativar este cliente? Ele poderá acessar o sistema novamente.",
        deactivateDescription:
          "Tem certeza que deseja desativar este cliente? Ele não poderá acessar o sistema enquanto estiver desativado.",
        confirmActivateButton: "Ativar",
        confirmDeactivateButton: "Desativar",
        successActive: "O cliente foi ativado com sucesso.",
        successDeactive: "O cliente foi desativado com sucesso.",
      },
    },
    RemoveEmployee: {
      title: "Remoção de funcionário",
      message: "Atenção: você realmente deseja remover este funcionário?",
      description:
        "Após a remoção, o funcionário não poderá mais ser utilizado no sistema. Utilize esta opção apenas quando o cadastro tiver sido realizado de forma incorreta.",
      successRemoveEmployee: "funcionário removido com sucesso.",
    },
    AdvanceReason: {
      description:
        "Tem certeza de que deseja remover este registro? Após a exclusão, não será possível recuperar esta informação.",
    },
    removeButton: "Remover",
    cancelButton: "Cancelar",
    updateButton: "Atualizar",
    registerButton: "Registrar",
    titleRemove: "Confirmação de exclusão",
    descriptionRemove:
      "Tem certeza de que deseja remover este registro? Esta ação não poderá ser desfeita.",
  },
};
