// Arquivo: src/utils/validacaoSenha.ts

export const validarRegrasSenha = (
  senha: string,
): { valida: boolean; erro: string } => {
  // Log para ver se a senha está chegando com espaços
  console.log(
    `[VALIDAÇÃO] Analisando: |${senha}| (Tamanho: ${senha?.length})`,
  );

  if (!senha)
    return { valida: false, erro: 'Senha vazia.' };

  if (senha.length <= 6) {
    return {
      valida: false,
      erro: 'A senha deve ter mais de 6 caracteres.',
    };
  }

  const temLetra = /[a-zA-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);

  if (!temLetra)
    return {
      valida: false,
      erro: 'A senha deve conter letras.',
    };
  if (!temNumero)
    return {
      valida: false,
      erro: 'A senha deve conter números.',
    };

  return { valida: true, erro: '' };
};
