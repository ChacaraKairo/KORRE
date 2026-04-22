import {
  Banknote,
  Calendar,
  Clock,
  Coffee,
  HeartPulse,
  User,
  Utensils,
} from 'lucide-react-native';
import React, { memo } from 'react';
import { View } from 'react-native';
import { FormularioViabilidade } from '../../../../type/viabilidadeCorrida'; // SSOT
import { AccordionSection } from '../ui/AccordionSection';
import { InputFinanceiro } from '../ui/InputFinanceiro';

interface SecaoCustoPessoaProps {
  form: Partial<FormularioViabilidade>;
  onChange: (
    campo: keyof FormularioViabilidade,
    valor: string,
  ) => void;
  onHelp: (titulo: string, texto: string) => void;
  isComplete: boolean;
}

export const SecaoCustoPessoa = memo(
  ({
    form,
    onChange,
    onHelp,
    isComplete,
  }: SecaoCustoPessoaProps) => {
    return (
      <AccordionSection
        title="Fator Humano (Você)"
        icon={<User size={20} color="#00C853" />}
        isComplete={isComplete}
        onHelpClick={() =>
          onHelp(
            'Fator Humano',
            'Sem preencher isso, você trabalha apenas para pagar as contas do carro.',
          )
        }
      >
        <View style={{ gap: 12 }}>
          {/* 1. SOBREVIVÊNCIA DIÁRIA */}
          <InputFinanceiro
            label="Alimentação Principal"
            value={String(form.alimentacao_diaria || '')}
            onChangeText={(v) =>
              onChange('alimentacao_diaria', v)
            }
            placeholder="R$ 0,00"
            icon={<Utensils size={18} color="#666" />}
            suffix="R$/Dia"
          />

          <InputFinanceiro
            label="Apoio Diário (Água, Café)"
            value={String(form.consumo_apoio_diario || '')}
            onChangeText={(v) =>
              onChange('consumo_apoio_diario', v)
            }
            placeholder="R$ 0,00"
            icon={<Coffee size={18} color="#666" />}
            suffix="R$/Dia"
          />

          {/* 2. CUSTOS FIXOS PESSOAIS */}
          <InputFinanceiro
            label="Plano de Saúde / Reserva"
            value={String(form.plano_saude_mensal || '')}
            onChangeText={(v) =>
              onChange('plano_saude_mensal', v)
            }
            placeholder="R$ 0,00"
            icon={<HeartPulse size={18} color="#666" />}
            suffix="R$/Mês"
          />

          {/* 3. A META (O PRO-LABORE) */}
          <InputFinanceiro
            label="Salário Líquido Desejado"
            value={String(
              form.salario_liquido_mensal_desejado || '',
            )}
            onChangeText={(v) =>
              onChange('salario_liquido_mensal_desejado', v)
            }
            placeholder="Ex: 5000"
            icon={<Banknote size={18} color="#00C853" />}
            suffix="R$/Mês"
            onHelp={() =>
              onHelp(
                'Meta de Lucro',
                'Quanto você quer que sobre NO SEU BOLSO após pagar as despesas.',
              )
            }
          />

          {/* 4. JORNADA DE TRABALHO */}
          <InputFinanceiro
            label="Dias de Trabalho / Semana"
            value={String(
              form.dias_trabalhados_semana || '',
            )}
            onChangeText={(v) =>
              onChange('dias_trabalhados_semana', v)
            }
            placeholder="Ex: 5"
            icon={<Calendar size={18} color="#666" />}
            suffix="Dias"
          />

          <InputFinanceiro
            label="Horas de Trabalho / Dia"
            value={String(form.horas_por_dia || '')}
            onChangeText={(v) =>
              onChange('horas_por_dia', v)
            }
            placeholder="Ex: 8"
            icon={<Clock size={18} color="#666" />}
            suffix="Horas"
          />
        </View>
      </AccordionSection>
    );
  },
);
