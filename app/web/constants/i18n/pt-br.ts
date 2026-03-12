// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export const PtBr = {
  Modal: {
    RegisterUser: {
      title: "Registrar Funcionário",
      inputNamePlaceholder: "Informe o nome do funcionário",
      errorEmptyName: "Por favor, informe o nome do funcionário.",
      errorInvalidName: "Por favor, informe um nome válido (apenas letras).",
      cancelButton: "Cancelar",
      registerButton: "Registrar",
      successRegisterUser: "Usuário registrado com sucesso",
    },
    UpdateStatusUser: {
      activateTitle: "Ativar usuário",
      deactivateTitle: "Desativar usuário",
      activateDescription:
        "Tem certeza que deseja ativar este usuário? Ele poderá acessar o sistema novamente.",
      deactivateDescription:
        "Tem certeza que deseja desativar este usuário? Ele não poderá acessar o sistema enquanto estiver desativado.",
      cancelButton: "Cancelar",
      confirmActivateButton: "Ativar",
      confirmDeactivateButton: "Desativar",
      successActiveUser: "O usuário foi ativado com sucesso.",
      successDeactiveUser: "O usuário foi desativado com sucesso.",
    },
    RemoveUser: {
      title: "Remoção de Usuário",
      message: "Atenção: você realmente deseja remover este usuário?",
      description:
        "Após a remoção, o usuário não poderá mais ser utilizado no sistema. Utilize esta opção apenas quando o cadastro tiver sido realizado de forma incorreta.",
      confirmButton: "Remover",
      cancelButton: "Cancelar",
      successRemoveUser: "Usuário removido com sucesso.",
    },
  },
};
