// Arquivo: src/components/telas/Dashboard/StatusGrid.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Gauge,
  Plus,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  AlertCircle,
  Wrench,
} from 'lucide-react-native';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';

interface StatusProps {
  kmAtual: number;
  itensVisiveis: any[];
  temManutencaoBanco: boolean; // Recebe a informação se o banco está vazio
  calcularProgresso: (item: any, km: number) => any;
  onUpdateKm: () => void;
  onOpenOficina: () => void;
}

export const StatusGrid: React.FC<StatusProps> = ({
  kmAtual,
  itensVisiveis,
  temManutencaoBanco,
  calcularProgresso,
  onUpdateKm,
  onOpenOficina,
}) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // ==========================================
  // LÓGICA DE DEFINIÇÃO DO STATUS (Movida da Tela para cá)
  // ==========================================
  let statusManutencao:
    | 'critical'
    | 'warning'
    | 'ok'
    | 'initial' = 'initial';
  let descManutencao = 'Verificar manutenções';

  // Só processa se houver dados REAIS salvos no banco
  if (
    temManutencaoBanco &&
    itensVisiveis &&
    itensVisiveis.length > 0
  ) {
    const analisados = itensVisiveis.map((item) => {
      const prog = calcularProgresso(item, kmAtual);
      return {
        ...item,
        statusItem: prog.status,
        perc: prog.percentagemDesgaste,
      };
    });

    const criticos = analisados.filter(
      (i) => i.statusItem === 'Crítico',
    );
    const atencao = analisados.filter(
      (i) => i.statusItem === 'Atenção',
    );

    if (criticos.length > 0) {
      statusManutencao = 'critical';
      descManutencao =
        criticos.length === 1
          ? `Atrasada: ${criticos[0].nome}`
          : `${criticos.length} manutenções atrasadas`;
    } else if (atencao.length > 0) {
      statusManutencao = 'warning';
      descManutencao =
        atencao.length === 1
          ? `Atenção: ${atencao[0].nome}`
          : `${atencao.length} manutenções próximas`;
    } else {
      statusManutencao = 'ok';
      // Pega o item com a maior porcentagem de desgaste para avisar qual é a próxima
      const proxima = analisados.reduce((prev, current) =>
        prev.perc > current.perc ? prev : current,
      );
      descManutencao = `Próxima: ${proxima.nome}`;
    }
  }

  // ==========================================
  // CONFIGURAÇÃO VISUAL
  // ==========================================
  const uiConfig = {
    critical: {
      icon: <AlertTriangle size={20} color="#FFF" />,
      label: 'Crítico',
    },
    warning: {
      icon: (
        <AlertCircle
          size={20}
          color={!isDark ? '#0A0A0A' : '#FFF'}
        />
      ),
      label: 'Atenção',
    },
    initial: {
      icon: (
        <Wrench
          size={20}
          color={!isDark ? '#0A0A0A' : '#FF9800'}
        />
      ),
      label: 'Sem Dados',
    },
    ok: {
      icon: <ShieldCheck size={20} color="#FFF" />,
      label: 'Em Dia',
    },
  };

  const UI = uiConfig[statusManutencao];

  return (
    <View style={styles.grid}>
      {/* Card Odómetro */}
      <TouchableOpacity
        style={[
          styles.cardMeio,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
          },
        ]}
        onPress={onUpdateKm}
        activeOpacity={0.8}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              padding: 8,
              backgroundColor: isDark
                ? '#202020'
                : '#F5F5F5',
              borderRadius: 12,
            }}
          >
            <Gauge size={20} color="#00C853" />
          </View>
          <View style={styles.btnPlusSmall}>
            <Plus size={20} color="#0A0A0A" />
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.labelMeta,
              { color: isDark ? '#666' : '#888' },
            ]}
          >
            KM ATUAL
          </Text>
          <Text
            style={[
              styles.valorDestaqueMeio,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            {kmAtual.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Card Manutenção */}
      <TouchableOpacity
        style={[
          styles.cardMeio,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
          },
          (styles as any)[`cardStatus_${statusManutencao}`],
          !isDark &&
            statusManutencao === 'warning' && {
              backgroundColor: '#FFC107',
              borderColor: '#FFB300',
            },
          statusManutencao === 'initial' && {
            backgroundColor: !isDark
              ? '#FF9800'
              : 'rgba(255, 152, 0, 0.15)',
            borderColor: !isDark ? '#F57C00' : '#FF9800',
          },
        ]}
        onPress={onOpenOficina}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={[
              {
                padding: 8,
                backgroundColor: isDark
                  ? '#202020'
                  : '#F5F5F5',
                borderRadius: 12,
              },
              !isDark &&
                (statusManutencao === 'warning' ||
                  statusManutencao === 'initial') && {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                },
              isDark &&
                statusManutencao === 'initial' && {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                },
            ]}
          >
            {UI.icon}
          </View>
          <ChevronRight
            size={18}
            color={
              !isDark &&
              (statusManutencao === 'warning' ||
                statusManutencao === 'initial')
                ? '#0A0A0A'
                : isDark && statusManutencao === 'initial'
                  ? '#FF9800'
                  : '#444'
            }
          />
        </View>
        <View>
          <Text
            style={[
              styles.labelMeta,
              (styles as any)[
                `textStatus_${statusManutencao}`
              ],
              !isDark &&
                (statusManutencao === 'warning' ||
                  statusManutencao === 'initial') && {
                  color: '#0A0A0A',
                },
              isDark &&
                statusManutencao === 'initial' && {
                  color: '#FF9800',
                },
            ]}
          >
            {UI.label}
          </Text>
          <Text
            style={[
              styles.descStatusMeio,
              { color: isDark ? '#888' : '#555' },
              !isDark &&
                (statusManutencao === 'warning' ||
                  statusManutencao === 'initial') && {
                  color: '#333333',
                },
              isDark &&
                statusManutencao === 'initial' && {
                  color: 'rgba(255, 152, 0, 0.8)',
                },
            ]}
            numberOfLines={1}
          >
            {descManutencao}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
