// Arquivo: src/hooks/perfil_user/usePerfil.ts
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
    console.log(
      '\n--- [PERFIL DEBUG] Iniciando carregarDados() ---',
    );
    try {
      // 1. Puxa o utilizador logado
      const user: any = await db.getFirstAsync(
        'SELECT * FROM perfil_usuario LIMIT 1',
      );

      if (user) {
        console.log(
          `[PERFIL DEBUG] Usuário encontrado: ID ${user.id} | Nome: ${user.nome}`,
        );
        setUsuario(user);

        const tm = user.tipo_meta || 'diaria';
        setTipoMeta(tm);

        const val =
          tm === 'semanal'
            ? user.meta_semanal
            : user.meta_diaria;
        setMeta(val ? val.toString() : '150');

        // 2. Busca todos os veículos para ver como está o banco agora
        const todosVeiculos = await db.getAllAsync(
          'SELECT id, modelo, placa, ativo FROM veiculos',
        );
        console.log(
          '[PERFIL DEBUG] Estado atual de todos os veículos no banco:',
          todosVeiculos,
        );

        // 3. Puxa o veículo ativo específico deste utilizador
        console.log(
          `[PERFIL DEBUG] Buscando veículo ativo para o user_id: ${user.id}...`,
        );
        const veic: any = await db.getFirstAsync(
          'SELECT * FROM veiculos WHERE ativo = 1 AND id_user = ? LIMIT 1',
          [user.id],
        );

        if (veic) {
          console.log(
            `[PERFIL DEBUG] Veículo ATIVO encontrado: ${veic.modelo} (${veic.placa})`,
          );
        } else {
          console.log(
            '[PERFIL DEBUG] ALERTA: Nenhum veículo retornado com ativo=1 para este usuário!',
          );
        }

        setVeiculo(veic);
      } else {
        console.log(
          '[PERFIL DEBUG] Nenhum usuário encontrado no banco.',
        );
      }
    } catch (error) {
      console.error(
        '[PERFIL DEBUG] Erro ao carregar dados do perfil:',
        error,
      );
    } finally {
      setLoading(false);
      console.log(
        '--- [PERFIL DEBUG] Fim do carregarDados() ---\n',
      );
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
        await db.runAsync(
          'UPDATE perfil_usuario SET foto_uri = ? WHERE id = ?',
          [novaFotoUri, usuario.id],
        );
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
          // @ts-ignore
          onPress: () => router.replace('/(auth)/login'),
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
    carregarDados, // A tela usa essa função para recarregar após trocar o veículo
  };
}
