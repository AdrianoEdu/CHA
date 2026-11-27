// Copyright (c) 2026-11-26
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Eduardo Trentin Junior.
// All rights reserved.

export const SCREEN_I18N_CUSTOMER_SCREEN = {
  Table: {
    title: 'Clientes',
    columns: {
      identification: 'identificação',
      createdAt: 'Criado em',
      customerName: 'Nome do cliente',
      phone: 'Telefone',
      address: 'Endereço',
      email: 'Email',
      cnpj: 'CNPJ',
      active: 'Ativo?',
      actions: 'Ações',
    }
  },
  messages: {
    createSuccess: 'Cliente registrado com sucesso',
    createError: 'Houve um erro para registar o cleinte, tente novamente',
    updateSucess: 'Cliente atualizado com sucesso',
    updateError: 'Houve um erro ao atualizar o cliente, tente novamente',
  }
}

// export const REGISTER_CUSTOMER = {
//   title: "Novo cliente",
//   legalEntity: "Pessoal jurídica?",
//   register: "Registrar",

//   columns: {
//     customerName: "Nome do cliente:",
//     customerCode: "Código do cliente",
//     phone: "Inserir telefone",
//     email: "Inserir o email",
//     address: "Inserir endereço:",
//   },

//   regex: {
//     onlyCNPJ: Regex.onlyCNPJ,
//     onlyCPF: Regex.onlyCPF,
//     onlyNumbers: Regex.onlyNumbers,
//     onlyEmail: Regex.onlyEmail,
//     invalidCharacters: "Por favor informar caracteres válidos",
//     invalidPhone: "Informe número válido.",
//     invalidEmail: "Informe um e-mail válido.",
//   },

//   messages: {
//     success: "Cliente registrado com sucesso",
//     error: "Houve um problema ao registrar o cliente:",
//   },

//   labels: {
//     CNPJ: "Informe o CNPJ",
//     CPF: "Informe o CPF",
//   },

//   maxLength: {
//     CNPJ: 18,
//     CPF: 14,
//     customerCode: 10,
//   },
// } as const;