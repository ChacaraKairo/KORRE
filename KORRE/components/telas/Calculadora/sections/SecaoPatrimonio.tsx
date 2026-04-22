import {
  BadgePercent,
  Coins,
  Landmark,
  TrendingDown,
} from 'lucide-react-native';
import React, { memo } from 'react';
import { View } from 'react-native';
// IMPORTANTE: Importando a Fonte Única de Verdade (SSOT)
import { FormularioViabilidade } from '../../../../type/viabilidadeCorrida';
import { AccordionSection } from '../ui/AccordionSection';
import { InputFinanceiro } from '../ui/InputFinanceiro';

interface SecaoPatrimonioProps {
  form: Partial<FormularioViabilidade>; // Atualizado para a SSOT
  onChange: (
    campo: keyof FormularioViabilidade, // Atualizado para a SSOT
    valor: string,
  ) => void;
  onHelp: (titulo: string, texto: string) => void;
  isComplete: boolean;
}

export const SecaoPatrimonio = memo(
  ({
    form,
    onChange,
    onHelp,
    isComplete,
  }: SecaoPatrimonioProps) => {
    return (
      <AccordionSection
        title="Patrimônio e Capital"
        icon={<Coins size={20} color="#00C853" />}
        isComplete={isComplete}
        onHelpClick={() =>
          onHelp(
            'Custos de Capital',
            'Aqui calculamos quanto o seu dinheiro custa. O veículo é um capital imobilizado que perde valor e deixa de render juros.',
          )
        }
      >
        <View style={{ gap: 12 }}>
          {/* 1. VALOR DO ATIVO */}
          <InputFinanceiro
            label="Valor do Veículo (Tabela FIPE)"
            value={String(form.valor_veiculo_fipe || '')}
            onChangeText={(v) =>
              onChange('valor_veiculo_fipe', v)
            }
            placeholder="R$ 0,00"
            icon={<Landmark size={18} color="#666" />}
            suffix="R$"
            onHelp={() =>
              onHelp(
                'Valor FIPE',
                'O valor atual de mercado do seu veículo. Ele é a base para o cálculo do Custo de Oportunidade.',
              )
            }
          />

          {/* 2. DEPRECIAÇÃO */}
          <InputFinanceiro
            label="Depreciação Anual Estimada"
            value={String(
              form.depreciacao_real_estimada || '',
            )}
            onChangeText={(v) =>
              onChange('depreciacao_real_estimada', v)
            }
            placeholder="Ex: 10"
            icon={<TrendingDown size={18} color="#666" />}
            suffix="%"
            onHelp={() =>
              onHelp(
                'Depreciação',
                'Quanto o seu veículo perde de valor por ano? A média de mercado para carros de aplicativo gira entre 10% a 15%.',
              )
            }
          />

          {/* 3. CUSTO DE OPORTUNIDADE (SELIC) */}
          <InputFinanceiro
            label="Taxa Selic Anual (Rendimento)"
            value={String(
              form.custo_oportunidade_selic || '',
            )}
            onChangeText={(v) =>
              onChange('custo_oportunidade_selic', v)
            }
            placeholder="Ex: 10.75"
            icon={
              <BadgePercent size={18} color="#00C853" />
            }
            suffix="%"
            onHelp={() =>
              onHelp(
                'Taxa SELIC',
                'É a taxa básica de juros. Usamos para calcular quanto você ganharia se o valor do carro estivesse aplicado no banco.',
              )
            }
          />
        </View>
      </AccordionSection>
    );
  },
);
