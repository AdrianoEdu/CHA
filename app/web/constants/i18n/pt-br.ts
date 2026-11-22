// Copyright (c) 2026-03-11
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { MODAL_I18N } from "./components/modal";
import { SCREEN_I18N } from "./screen/bankStatement";
import { COMBOBOX_I18N } from "./components/Combobox";
import RemoveModal from "../../components/modal/remove-employee/remove-employee";


export const PtBr = {
  Components: {
    ComboBox: { ...COMBOBOX_I18N },
    Modal: {
      Generic: { ...MODAL_I18N.Generic },
      RemoveModal: { ...MODAL_I18N.RemoveModal },
      UpsertAccount: { ...MODAL_I18N.UpsertAccount },
      UpsertBank: { ...MODAL_I18N.UpsertBank },
      EmployeeAdvanced: { ...MODAL_I18N.EmployeeAdvanced },
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
    },
  },
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
    BankStatement: { ...SCREEN_I18N.BankStatement },
    AccountScreen: { ...SCREEN_I18N.AccountScreen },
  },

};
