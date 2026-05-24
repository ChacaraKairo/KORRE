import { MaintenanceNotificationChecker } from './checkers/MaintenanceNotificationChecker';
import { FinancialNotificationChecker } from './checkers/FinancialNotificationChecker';
import { BackupNotificationChecker } from './checkers/BackupNotificationChecker';
import { IndicesNotificationChecker } from './checkers/IndicesNotificationChecker';
import { RideNotificationChecker } from './checkers/RideNotificationChecker';
import { MeiNotificationChecker } from './checkers/MeiNotificationChecker';
import { OnboardingNotificationChecker } from './checkers/OnboardingNotificationChecker';
import { SystemNotificationChecker } from './checkers/SystemNotificationChecker';
import { GarageNotificationChecker } from './checkers/GarageNotificationChecker';

/**
 * Executa a função de executar verificacoes locais.
 */
export async function executarVerificacoesLocais() {
  await MaintenanceNotificationChecker.run();
  await FinancialNotificationChecker.run();
  await BackupNotificationChecker.run();
  await IndicesNotificationChecker.run();
  await GarageNotificationChecker.run();
  await RideNotificationChecker.run();
  await MeiNotificationChecker.run();
  await OnboardingNotificationChecker.run();
  await SystemNotificationChecker.run();
}

/**
 * Executa a função de verificar alertas manutencao.
 */
export async function verificarAlertasManutencao() {
  await MaintenanceNotificationChecker.run();
}

/**
 * Executa a função de verificar meta diaria.
 */
export async function verificarMetaDiaria() {
  await FinancialNotificationChecker.verificarMetaDiaria();
}

/**
 * Executa a função de verificar lancamentos recentes.
 */
export async function verificarLancamentosRecentes() {
  await FinancialNotificationChecker.verificarSemLancamentos();
}

/**
 * Executa a função de verificar gastos acima da media.
 */
export async function verificarGastosAcimaDaMedia() {
  return;
}

/**
 * Executa a função de verificar indices financeiros desatualizados.
 */
export async function verificarIndicesFinanceirosDesatualizados() {
  await IndicesNotificationChecker.run();
}

/**
 * Executa a função de verificar backup pendente.
 */
export async function verificarBackupPendente() {
  await BackupNotificationChecker.run();
}

/**
 * Executa a função de verificar das mei pendente.
 */
export async function verificarDasMeiPendente() {
  await MeiNotificationChecker.run();
}
