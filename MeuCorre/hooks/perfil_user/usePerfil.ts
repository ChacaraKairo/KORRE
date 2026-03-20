import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';
import { PhotoService } from '../../components/telas/Cadastro/script/photoService';
import { showCustomAlert } from '../alert/useCustomAlert';

export function usePerfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [veiculo, setVeiculo] = useState<any>(null);
  const [meta, setMeta] = useState('');
  const [tipoMeta, setTipoMeta] = useState<
    'diaria' | 'semanal'
  >('diaria');
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      // Puxa o utilizador logado
      const user: any = await db.getFirstAsync(
        'SELECT * FROM perfil_usuario LIMIT 1',
      );
      if (user) {
        setUsuario(user);
        const tm = user.tipo_meta || 'diaria';
        setTipoMeta(tm);
        const val =
          tm === 'semanal'
            ? user.meta_semanal
            : user.meta_diaria;
        setMeta(val ? val.toString() : '150');
      }

      // Puxa o veículo ativo
      const veic: any = await db.getFirstAsync(
        'SELECT * FROM veiculos WHERE ativo = 1',
      );
      setVeiculo(veic);
    } catch (error) {
      console.error(
        'Erro ao carregar dados do perfil:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarMeta = async () => {
    if (!usuario) return;
    try {
      const valorFormatado = parseFloat(
        meta.replace(',', '.'),
      );
      const campo =
        tipoMeta === 'semanal'
          ? 'meta_semanal'
          : 'meta_diaria';
      await db.runAsync(
        `UPDATE perfil_usuario SET ${campo} = ? WHERE id = ?`,
        [valorFormatado, usuario.id],
      );
      showCustomAlert(
        'Sucesso',
        'A tua meta diária foi atualizada!',
      );
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível atualizar a meta.',
      );
    }
  };
  const alterarFoto = async () => {
    try {
      const novaFotoUri = await PhotoService.takePhoto(
        usuario?.foto_uri,
      );

      if (novaFotoUri) {
        // Atualiza no banco de dados
        await db.runAsync(
          'UPDATE perfil_usuario SET foto_uri = ? WHERE id = ?',
          [novaFotoUri, usuario.id],
        );

        // Atualiza a tela imediatamente (recarrega os dados do utilizador)
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao alterar foto:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível alterar a foto de perfil.',
      );
    }
  };

  const realizarLogout = () => {
    showCustomAlert(
      'Sair da Conta',
      'Tens a certeza que desejas sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () =>
            router.replace('/(auth)/login' as any),
        },
      ],
    );
  };

  return {
    usuario,
    veiculo,
    meta,
    setMeta,
    tipoMeta,
    loading,
    alterarFoto,
    salvarMeta,
    realizarLogout,
    carregarDados,
  };
}
