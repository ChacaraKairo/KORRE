import { MaintenanceNotificationChecker } from './checkers/MaintenanceNotificationChecker';
import { FinancialNotificationChecker } from './checkers/FinancialNotificationChecker';
import { BackupNotificationChecker } from './checkers/BackupNotificationChecker';
import { IndicesNotificationChecker } from './checkers/IndicesNotificationChecker';
import { RideNotificationChecker } from './checkers/RideNotificationChecker';
import { MeiNotificationChecker } from './checkers/MeiNotificationChecker';
import { OnboardingNotificationChecker } from './checkers/OnboardingNotificationChecker';
import { SystemNotificationChecker } from './checkers/SystemNotificationChecker';
import { GarageNotificationChecker } from './checkers/GarageNotificationChecker';
import { configurarNotificacaoDiaria } from './DailyEngagementNotificationService';

export async function executarVerificacoesLocais() {
  await configurarNotificacaoDiaria();
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

export async function verificarAlertasManutencao() {
  await MaintenanceNotificationChecker.run();
}

export async function verificarMetaDiaria() {
  await FinancialNotificationChecker.verificarMetaDiaria();
}

export async function verificarLancamentosRecentes() {
  await FinancialNotificationChecker.verificarSemLancamentos();
}

export async function verificarGastosAcimaDaMedia() {
  return;
}

export async function verificarIndicesFinanceirosDesatualizados() {
  await IndicesNotificationChecker.run();
}

export async function verificarBackupPendente() {
  await BackupNotificationChecker.run();
}

export async function verificarDasMeiPendente() {
  await MeiNotificationChecker.run();
}
