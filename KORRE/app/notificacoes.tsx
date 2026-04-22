import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useTema } from '../hooks/modo_tema';
import { useNotificacoes } from '../hooks/notificacoes/useNotificacoes';
import { styles } from '../styles/telas/Perfil/perfilStyles'; // Aproveitando os seus estilos base

export default function NotificacoesScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const {
    notificacoes,
    marcarComoLida,
    limparHistorico,
    dispararNotificacao,
  } = useNotificacoes();

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle size={24} color="#F44336" />;
      case 'sucesso':
        return <CheckCircle2 size={24} color="#00C853" />;
      default:
        return <Bell size={24} color="#2196F3" />;
    }
  };

  return (
    <View
      style={[
        { flex: 1 },
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingBottom: 10 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              backgroundColor: isDark ? '#161616' : '#FFF',
              borderRadius: 12,
            }}
          >
            <ArrowLeft
              size={20}
              color={isDark ? '#FFF' : '#000'}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: isDark ? '#FFF' : '#000',
              fontSize: 20,
              fontWeight: '900',
            }}
          >
            Notificações
          </Text>
        </View>
        <TouchableOpacity
          onPress={limparHistorico}
          style={{ padding: 8 }}
        >
          <Trash2 size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* Botão de Teste (Remova quando for publicar a app) */}
      <TouchableOpacity
        onPress={() =>
          dispararNotificacao(
            '💰 Meta Próxima!',
            'Faltam apenas R$ 25 para bateres a tua meta diária!',
            'sucesso',
          )
        }
        style={{
          margin: 20,
          padding: 16,
          backgroundColor: '#00C853',
          borderRadius: 16,
          alignItems: 'center',
        }}
      >
        <Text
          style={{ color: '#0A0A0A', fontWeight: '900' }}
        >
          TESTAR NOTIFICAÇÃO 📲
        </Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
        }}
      >
        {notificacoes.length === 0 ? (
          <Text
            style={{
              color: '#666',
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            Nenhuma notificação no momento.
          </Text>
        ) : (
          notificacoes.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              onPress={() => marcarComoLida(notif.id)}
              style={{
                flexDirection: 'row',
                backgroundColor: isDark
                  ? '#161616'
                  : '#FFF',
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: isDark ? '#222' : '#E0E0E0',
                opacity: notif.lida ? 0.6 : 1, // Fica mais transparente se já foi lida
              }}
            >
              <View
                style={{ marginRight: 16, marginTop: 4 }}
              >
                {getIcone(notif.tipo)}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: isDark ? '#FFF' : '#000',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}
                >
                  {notif.titulo}
                </Text>
                <Text
                  style={{
                    color: isDark ? '#888' : '#555',
                    fontSize: 14,
                  }}
                >
                  {notif.mensagem}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
