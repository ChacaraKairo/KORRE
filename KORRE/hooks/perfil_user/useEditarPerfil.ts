import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import db from '../../database/DatabaseInit';
import { hashPassword } from '../../utils/auth/passwordHash';
import { logger } from '../../utils/logger';
import { showCustomAlert } from '../alert/useCustomAlert';

type TipoMeta = 'diaria' | 'semanal';

interface PerfilUsuario {
  nome?: string | null;
  tipo_meta?: TipoMeta | null;
}

interface VeiculoPerfil {
  id: number;
  modelo: string;
  tipo?: string | null;
  placa?: string | null;
}

export function useEditarPerfil(
  visivel: boolean,
  onClose: () => void,
  onSalvoSucesso: () => void,
) {
  const { t } = useTranslation();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoMeta, setTipoMeta] =
    useState<TipoMeta>('diaria');
  const [veiculos, setVeiculos] = useState<VeiculoPerfil[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    try {
      const user =
        await db.getFirstAsync<PerfilUsuario>(
          `SELECT nome, tipo_meta
           FROM perfil_usuario
           LIMIT 1`,
        );

      if (user) {
        setNome(user.nome || '');
        setSenha('');
        setTipoMeta(
          user.tipo_meta === 'semanal' ? 'semanal' : 'diaria',
        );
      }

      const listaVeiculos =
        await db.getAllAsync<VeiculoPerfil>(
          'SELECT id, modelo, tipo, placa FROM veiculos',
        );
      setVeiculos(listaVeiculos);
    } catch (error) {
      logger.error(
        '[EditarPerfil] Erro ao carregar dados:',
        error,
      );
    }
  };

  useEffect(() => {
    if (visivel) {
      carregarDados();
    }
  }, [visivel]);

  const salvarDados = async () => {
    if (!nome.trim()) {
      showCustomAlert(
        t('common.atencao'),
        t('perfil.nome_obrigatorio'),
      );
      return;
    }

    setLoading(true);
    try {
      if (senha.trim()) {
        const senhaCriptografada = await hashPassword(
          senha.trim(),
        );
        await db.runAsync(
          'UPDATE perfil_usuario SET nome = ?, senha = ?, tipo_meta = ?',
          [nome.trim(), senhaCriptografada, tipoMeta],
        );
      } else {
        await db.runAsync(
          'UPDATE perfil_usuario SET nome = ?, tipo_meta = ?',
          [nome.trim(), tipoMeta],
        );
      }

      showCustomAlert(
        t('common.sucesso'),
        t('perfil.dados_atualizados'),
      );
      onSalvoSucesso();
      onClose();
    } catch (error) {
      logger.error(
        '[EditarPerfil] Erro ao salvar edicao:',
        error,
      );
      showCustomAlert(
        t('common.erro'),
        t('perfil.erro_salvar_dados'),
      );
    } finally {
      setLoading(false);
    }
  };

  const apagarVeiculo = (id: number, modelo: string) => {
    showCustomAlert(
      t('perfil.apagar_veiculo_titulo'),
      t('perfil.apagar_veiculo_confirmacao', { modelo }),
      [
        { text: t('common.cancelar'), style: 'cancel' },
        {
          text: t('perfil.apagar'),
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync(
                'DELETE FROM veiculos WHERE id = ?',
                [id],
              );
              setVeiculos((prev) =>
                prev.filter((veiculo) => veiculo.id !== id),
              );
            } catch (error) {
              logger.error(
                '[EditarPerfil] Erro ao apagar veiculo:',
                error,
              );
              showCustomAlert(
                t('common.erro'),
                t('perfil.erro_apagar_veiculo'),
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
