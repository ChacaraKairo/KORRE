// Arquivo: src/utils/validacaoCpf.ts

export const validarCPF = (
  cpf: string,
): { valida: boolean; erro: string } => {
  // Remove tudo que não for número
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return {
      valida: false,
      erro: 'O CPF deve conter exatamente 11 números.',
    };
  }

  // Elimina CPFs inválidos conhecidos (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpfLimpo)) {
    return {
      valida: false,
      erro: 'Este formato de CPF é inválido.',
    };
  }

  // Validação do 1º dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return {
      valida: false,
      erro: 'CPF inválido. Verifique os números digitados.',
    };
  }

  // Validação do 2º dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return {
      valida: false,
      erro: 'CPF inválido. Verifique os números digitados.',
    };
  }

  // Passou em todas as validações
  return { valida: true, erro: '' };
};
