// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export const PtBr = {
  Modal: {
    RegisterEmployee: {
      title: "Registrar Funcionário",
      inputNamePlaceholder: "Informe o nome do funcionário",
      errorEmptyName: "Por favor, informe o nome do funcionário.",
      errorInvalidName: "Por favor, informe um nome válido (apenas letras).",
      cancelButton: "Cancelar",
      registerButton: "Registrar",
      successRegisterEmployee: "Funcionário registrado com sucesso",
    },
    UpdateStatusEmployee: {
      activateTitle: "Habilitar Funcionáio",
      deactivateTitle: "Desativar Funcionário",
      activateDescription:
        "Tem certeza que deseja ativar este funcionário? Ele poderá acessar o sistema novamente.",
      deactivateDescription:
        "Tem certeza que deseja desativar este funcionário? Ele não poderá acessar o sistema enquanto estiver desativado.",
      cancelButton: "Cancelar",
      confirmActivateButton: "Ativar",
      confirmDeactivateButton: "Desativar",
      successActiveEmployee: "O funcionário foi ativado com sucesso.",
      successDeactiveEmployee: "O funcionário foi desativado com sucesso.",
    },
    RemoveEmployee: {
      title: "Remoção de funcionário",
      message: "Atenção: você realmente deseja remover este funcionário?",
      description:
        "Após a remoção, o funcionário não poderá mais ser utilizado no sistema. Utilize esta opção apenas quando o cadastro tiver sido realizado de forma incorreta.",
      confirmButton: "Remover",
      cancelButton: "Cancelar",
      successRemoveEmployee: "funcionário removido com sucesso.",
    },
  },
};
