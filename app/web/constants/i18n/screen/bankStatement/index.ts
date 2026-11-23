


export const SCREEN_I18N = {
  BankStatement: {
    title: "Extrato bancário",
    addMovement: "Adicionar movimentação",
    addStatement: "Adicionar extrato",
    fields: {
      bank: "Banco",
      account: "Conta",
    },
    messages: {
      registerError: 'Não foi possível registrar extrat, tente novamente',
      registerSuccess: "Extrato registrado com sucesso!",
      updateSuccess: "Extrato atualizado com sucesso!",
      updateError: "Houve um erro ao atualizar o extrato, tente novamente",
    },
  },
  AccountScreen: {
    messages: {
      removeSuccess: 'Conta corrente removida com sucesso',
      removeError: 'Não foi possível remover conta corrente, tente mais tarde',
      createSuccess: "Conta corrente criada com sucesso",
      createError: "Não foi possível criar conta corrent",
      updateSuccess: "Conta corrent atualizada com sucesso",
      updateError: "Não foi possível atualizar conta corrente",
    },
    columns: {
      createdAt: "Registrado em",
      bank: "Banco",
      accountNumber: "Número da conta",
      balance: "Saldo",
      actions: "Ações",
    },
    title: "Conta corrente",
    route: "/web/view/home/bank/accounts/statement",
  },
  FinancialCategory: {
    messages: {
      registerSuccess: "Categoria financeira registrada com sucesso",
      registerError: 'Não foi possível registrar a categoria financeira, tente novamente',
      updateSuccess: "Categoria financeira atualizada com sucesso",
      updateError: "Não foi possível atualizar a Categoria financeira, tente novamente",
      removeSuccess: "Categoria financeira removida com sucesso",
      removeError: 'Não foi possível remover a categoria financeira tente novamente',
    },
    Table: {
      title: 'Entradas e saídas',
      columns: {
        createdAt: "Criado em",
        name: "Nome",
        reference: "Referente",
        bank: "Banco",
        cashBook: "Livro Caixa",
        type: "Tipo",
        income: "Entrada",
        expense: "Saída",
        actions: "Ações",
      }
    }
  }
}