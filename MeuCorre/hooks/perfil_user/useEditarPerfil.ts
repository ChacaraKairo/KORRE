import { useState, useEffect } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useEditarPerfil(
  visivel: boolean,
  onClose: () => void,
  onSalvoSucesso: () => void,
) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoMeta, setTipoMeta] = useState<
    'diaria' | 'semanal'
  >('diaria');
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega os dados sempre que o modal for aberto
  useEffect(() => {
    if (visivel) {
      carregarDados();
    }
  }, [visivel]);

  const carregarDados = async () => {
    try {
      // Pega o utilizador (Assumindo que há apenas 1 perfil local)
      const user: any = await db.getFirstAsync(
        'SELECT * FROM perfil_usuario LIMIT 1',
      );
      if (user) {
        setNome(user.nome || '');
        setSenha(user.senha || '');
        setTipoMeta(user.tipo_meta || 'diaria');
      }

      // Pega todos os veículos para a lista de exclusão
      const listaVeiculos = await db.getAllAsync(
        'SELECT * FROM veiculos',
      );
      console.log(
        `[EditarPerfil] Dados carregados. Usuário: ${user?.nome}. Veículos na conta: ${listaVeiculos.length}`,
      );
      setVeiculos(listaVeiculos);
    } catch (error) {
      console.error(
        '[EditarPerfil] Erro ao carregar dados para edição:',
        error,
      );
    }
  };

  const salvarDados = async () => {
    if (!nome.trim()) {
      console.log(
        '[EditarPerfil] Erro de validação: Nome vazio.',
      );
      showCustomAlert(
        'Aviso',
        'O nome não pode estar vazio.',
      );
      return;
    }

    setLoading(true);
    try {
      console.log(
        '[EditarPerfil] Tentando atualizar dados do usuário...',
      );
      await db.runAsync(
        'UPDATE perfil_usuario SET nome = ?, senha = ?, tipo_meta = ?',
        [nome.trim(), senha, tipoMeta],
      );

      console.log(
        '[EditarPerfil] Perfil atualizado com sucesso.',
      );
      showCustomAlert(
        'Sucesso',
        'Os teus dados foram atualizados!',
      );
      onSalvoSucesso(); // Avisa a tela de perfil para recarregar os dados
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(
        '[EditarPerfil] Erro ao salvar edição de perfil:',
        error,
      );
      showCustomAlert(
        'Erro',
        'Ocorreu um problema ao salvar os dados.',
      );
    } finally {
      setLoading(false);
    }
  };

  const apagarVeiculo = (id: number, modelo: string) => {
    showCustomAlert(
      'Apagar Veículo',
      `Tens a certeza que queres apagar o veículo ${modelo}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(
                `[EditarPerfil] Removendo veículo ID: ${id} a pedido do usuário.`,
              );
              await db.runAsync(
                'DELETE FROM veiculos WHERE id = ?',
                [id],
              );
              console.log(
                '[EditarPerfil] Veículo removido com sucesso da conta.',
              );
              // Remove da lista atual da tela para não precisar recarregar tudo
              setVeiculos((prev) =>
                prev.filter((v) => v.id !== id),
              );
            } catch (error) {
              console.error(
                '[EditarPerfil] Erro ao tentar apagar o veículo:',
                error,
              );
              showCustomAlert(
                'Erro',
                'Não foi possível apagar o veículo.',
              );
            }
          },
        },
      ],
    );
  };

  return {
    nome,
    setNome,
    senha,
    setSenha,
    tipoMeta,
    setTipoMeta,
    veiculos,
    loading,
    salvarDados,
    apagarVeiculo,
  };
}
