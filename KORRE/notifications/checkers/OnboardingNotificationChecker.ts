import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';

export const OnboardingNotificationChecker = {
  async run() {
    const usuario = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM perfil_usuario LIMIT 1',
    );
    if (!usuario) return;

    const veiculo = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM veiculos WHERE id_user = ? LIMIT 1',
      [usuario.id],
    );
    if (!veiculo) {
      await criarNotificacao({
        titulo: 'Finalize seu onboarding',
        mensagem: 'Cadastre seu primeiro veiculo para comecar no KORRE.',
        tipo: 'uso_app',
        prioridade: 'alta',
        destino: AppRoutes.garagem,
        canal: 'historico',
        grupoPreferencia: 'uso_app',
        dedupKey: `onboarding_sem_veiculo:${usuario.id}`,
      });
      return;
    }

    const auditoria = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM parametros_financeiros WHERE veiculo_id = ?',
      [veiculo.id],
    );
    if (!Number(auditoria?.total || 0)) {
      await criarNotificacao({
        titulo: 'Veiculo sem auditoria',
        mensagem: 'Preencha a Auditoria KORRE para calcular seus indices.',
        tipo: 'uso_app',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'uso_app',
        dedupKey: `onboarding_sem_auditoria:${veiculo.id}`,
      });
    }
  },
};
