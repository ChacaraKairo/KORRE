export type TipoNotificacao =
  | 'info'
  | 'alerta'
  | 'sucesso'
  | 'sistema'
  | 'servidor'
  | 'manutencao'
  | 'financeiro'
  | 'backup'
  | 'seguranca'
  | 'indices'
  | 'corrida'
  | 'auditoria'
  | 'oficina'
  | 'garagem'
  | 'meta'
  | 'mei'
  | 'uso_app'
  | 'privacidade'
  | 'suporte';

export type PrioridadeNotificacao =
  | 'baixa'
  | 'media'
  | 'alta'
  | 'critica';

export type OrigemNotificacao = 'local' | 'servidor' | 'sistema';

export type CanalNotificacao =
  | 'local'
  | 'push'
  | 'historico'
  | 'in_app';

export type GrupoPreferenciaNotificacao =
  | 'manutencao'
  | 'financeiro'
  | 'backup'
  | 'indices'
  | 'corrida'
  | 'seguranca'
  | 'mei'
  | 'uso_app'
  | 'privacidade'
  | 'sistema';

export interface CriarNotificacaoInput {
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  prioridade?: PrioridadeNotificacao;
  origem?: OrigemNotificacao;
  canal?: CanalNotificacao;
  destino?: string;
  dados?: Record<string, unknown>;
  dedupKey?: string;
  grupoPreferencia?: GrupoPreferenciaNotificacao;
}

export interface NotificacaoHistorico
  extends CriarNotificacaoInput {
  id: number;
  lida: number;
  data_criacao: string;
}
