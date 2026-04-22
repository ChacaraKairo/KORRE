// MeuCorre/app/(auth)/termos.tsx
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/Termos/termosStyles';

export default function TermosScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#AAA' : '#555';

  const BulletPoint = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <View style={styles.bulletContainer}>
      <Text style={[styles.bullet, { color: '#00C853' }]}>
        {'\u2022'}
      </Text>
      <Text
        style={[styles.bulletText, { color: textMuted }]}
      >
        {children}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight
              : 0,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: borderColor },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.btnVoltar,
              { backgroundColor: cardColor },
            ]}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: textColor },
            ]}
          >
            Termos e Privacidade
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <ShieldCheck size={48} color="#00C853" />
        </View>

        <Text
          style={[styles.mainTitle, { color: textColor }]}
        >
          1. Termos de Uso
        </Text>
        <Text
          style={[styles.lastUpdate, { color: textMuted }]}
        >
          Última atualização: Março de 2026
        </Text>

        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Bem-vindo ao MeuCorre. Ao utilizar este
          aplicativo, você concorda com os termos descritos
          abaixo. Por favor, leia-os com atenção.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          1. Natureza do Serviço (Aviso Importante)
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          O MeuCorre é uma ferramenta de gerenciamento e
          anotações pessoais voltada para motoristas e
          entregadores.
        </Text>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Não somos uma instituição financeira:
          </Text>{' '}
          O aplicativo não realiza, processa ou intermedia
          pagamentos, transferências, depósitos ou qualquer
          tipo de movimentação bancária.
        </BulletPoint>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Anotações Manuais:
          </Text>{' '}
          Todos os valores de ganhos e gastos exibidos são
          inseridos manualmente pelo usuário. O saldo
          exibido é meramente informativo e estatístico, sem
          valor legal ou bancário.
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          2. Cadastro e Segurança
        </Text>
        <BulletPoint>
          O usuário é responsável pela veracidade das
          informações cadastradas (nome, veículo,
          quilometragem).
        </BulletPoint>
        <BulletPoint>
          O acesso é protegido por senha definida pelo
          usuário. A guarda e o sigilo desta senha são de
          inteira responsabilidade do utilizador.
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          3. Limitação de Responsabilidade
        </Text>
        <BulletPoint>
          O MeuCorre fornece estimativas de manutenção e
          lucros baseadas nos dados fornecidos pelo usuário.
          Não nos responsabilizamos por falhas mecânicas,
          erros de cálculo ou decisões financeiras tomadas
          com base nas informações do app.
        </BulletPoint>
        <BulletPoint>
          O aplicativo utiliza armazenamento local (SQLite).
          Em caso de perda do dispositivo ou exclusão do
          cache do app sem backup, os dados podem ser
          perdidos.
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          4. Modificações
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Reservamo-nos o direito de modificar estes termos
          a qualquer momento. O uso continuado do aplicativo
          após alterações constitui aceitação dos novos
          termos.
        </Text>

        <View
          style={[
            styles.separator,
            { backgroundColor: borderColor },
          ]}
        />

        <Text
          style={[styles.mainTitle, { color: textColor }]}
        >
          2. Política de Privacidade
        </Text>
        <Text
          style={[styles.lastUpdate, { color: textMuted }]}
        >
          Última atualização: Março de 2026
        </Text>

        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Esta Política de Privacidade explica como o
          MeuCorre lida com as suas informações.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          1. Coleta de Dados
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Coletamos apenas os dados necessários para o
          funcionamento das funcionalidades de gestão:
        </Text>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Perfil:
          </Text>{' '}
          Nome e sobrenome.
        </BulletPoint>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Veículo:
          </Text>{' '}
          Marca, modelo, placa, motorização e quilometragem.
        </BulletPoint>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Financeiro:
          </Text>{' '}
          Registros de ganhos, despesas e categorias de
          gastos.
        </BulletPoint>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Security:
          </Text>{' '}
          Senha de acesso armazenada de forma local.
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          2. Armazenamento dos Dados (Uso Local)
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          O MeuCorre prioriza a sua privacidade.
        </Text>
        <BulletPoint>
          <Text style={{ fontWeight: 'bold' }}>
            Banco de Dados Local:
          </Text>{' '}
          Os seus dados de faturamento, rotas e gastos são
          armazenados primordialmente no seu dispositivo
          através de um banco de dados SQLite (Offline).
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          3. Uso das Informações
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          As informações coletadas servem exclusivamente
          para:
        </Text>
        <BulletPoint>
          Gerar relatórios de desempenho financeiro.
        </BulletPoint>
        <BulletPoint>
          Calcular alertas de manutenção preventiva.
        </BulletPoint>
        <BulletPoint>
          Personalizar a experiência do usuário no
          Dashboard.
        </BulletPoint>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          4. Compartilhamento de Dados
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Nós não vendemos nem compartilhamos seus dados
          pessoais ou financeiros com terceiros. Os dados
          são utilizados apenas para as funções internas do
          aplicativo.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          5. Seus Direitos
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Você pode, a qualquer momento, alterar ou excluir
          seus dados diretamente nas configurações do
          aplicativo. Ao excluir sua conta, todos os
          registros armazenados localmente serão apagados
          permanentemente.
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: textColor },
          ]}
        >
          6. Segurança
        </Text>
        <Text
          style={[styles.paragraph, { color: textMuted }]}
        >
          Empregamos medidas técnicas para proteger seus
          dados, mas lembramos que nenhum método de
          armazenamento eletrônico local é 100% seguro
          contra acesso indevido ao aparelho desbloqueado.
          Recomendamos o uso de senhas fortes no seu
          dispositivo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
