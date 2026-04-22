import {
  CircleDot,
  Droplets,
  Fuel,
  Gauge,
  Wrench,
} from 'lucide-react-native';
import React, { memo } from 'react';
import { View } from 'react-native';
import { FormularioViabilidade } from '../../../../type/viabilidadeCorrida'; // SSOT
import { AccordionSection } from '../ui/AccordionSection';
import { InputFinanceiro } from '../ui/InputFinanceiro';

interface SecaoCustosAtivoProps {
  form: Partial<FormularioViabilidade>;
  onChange: (
    campo: keyof FormularioViabilidade,
    valor: string,
  ) => void;
  onHelp: (titulo: string, texto: string) => void;
  isComplete: boolean;
}

export const SecaoCustosAtivo = memo(
  ({
    form,
    onChange,
    onHelp,
    isComplete,
  }: SecaoCustosAtivoProps) => {
    return (
      <AccordionSection
        title="Custos de Movimento (KM)"
        icon={<Gauge size={20} color="#00C853" />}
        isComplete={isComplete}
        onHelpClick={() =>
          onHelp(
            'Custos de Movimento',
            'Valores consumidos enquanto você roda. Compõem o IKM.',
          )
        }
      >
        <View style={{ gap: 12 }}>
          {/* 1. COMBUSTÍVEL / ENERGIA */}
          <InputFinanceiro
            label="Preço do Combustível / kWh"
            value={String(form.preco_energia_unidade || '')}
            onChangeText={(v) =>
              onChange('preco_energia_unidade', v)
            }
            placeholder="R$ 0,00"
            icon={<Fuel size={18} color="#666" />}
            suffix="R$/L ou kWh"
          />

          <InputFinanceiro
            label="Média de Consumo"
            value={String(
              form.rendimento_energia_unidade || '',
            )}
            onChangeText={(v) =>
              onChange('rendimento_energia_unidade', v)
            }
            placeholder="0.0"
            icon={<Gauge size={18} color="#666" />}
            suffix="KM/L"
          />

          {/* 2. PNEUS */}
          <InputFinanceiro
            label="Valor do Jogo de Pneus"
            value={String(form.valor_jogo_pneus || '')}
            onChangeText={(v) =>
              onChange('valor_jogo_pneus', v)
            }
            placeholder="R$ 0,00"
            icon={<CircleDot size={18} color="#666" />}
            suffix="R$"
          />

          <InputFinanceiro
            label="Durabilidade dos Pneus"
            value={String(form.durabilidade_pneus_km || '')}
            onChangeText={(v) =>
              onChange('durabilidade_pneus_km', v)
            }
            placeholder="Ex: 40000"
            icon={<Gauge size={18} color="#666" />}
            suffix="KM"
          />

          {/* 3. ÓLEO E FILTROS */}
          <InputFinanceiro
            label="Custo Óleo e Filtros"
            value={String(form.valor_oleo_filtros || '')}
            onChangeText={(v) =>
              onChange('valor_oleo_filtros', v)
            }
            placeholder="R$ 0,00"
            icon={<Droplets size={18} color="#666" />}
            suffix="R$"
          />

          <InputFinanceiro
            label="Intervalo de Troca (Óleo)"
            value={String(
              form.intervalo_oleo_filtros_km || '',
            )}
            onChangeText={(v) =>
              onChange('intervalo_oleo_filtros_km', v)
            }
            placeholder="Ex: 10000"
            icon={<Gauge size={18} color="#666" />}
            suffix="KM"
          />

          {/* 4. FREIOS E TRANSMISSÃO (Novos inputs para precisão!) */}
          <InputFinanceiro
            label="Valor Freios (Pastilha/Disco)"
            value={String(
              form.valor_manutencao_freios || '',
            )}
            onChangeText={(v) =>
              onChange('valor_manutencao_freios', v)
            }
            placeholder="R$ 0,00"
            icon={<Wrench size={18} color="#666" />}
            suffix="R$"
          />

          <InputFinanceiro
            label="Intervalo de Troca (Freios)"
            value={String(form.intervalo_freios_km || '')}
            onChangeText={(v) =>
              onChange('intervalo_freios_km', v)
            }
            placeholder="Ex: 20000"
            icon={<Gauge size={18} color="#666" />}
            suffix="KM"
          />

          {/* Kit Relação (Motos) ou Correia Dentada (Carros) */}
          <InputFinanceiro
            label="Kit Transmissão / Correia"
            value={String(form.valor_kit_transmissao || '')}
            onChangeText={(v) =>
              onChange('valor_kit_transmissao', v)
            }
            placeholder="R$ 0,00"
            icon={<Wrench size={18} color="#666" />}
            suffix="R$"
          />

          <InputFinanceiro
            label="Durabilidade Transmissão"
            value={String(
              form.durabilidade_transmissao_km || '',
            )}
            onChangeText={(v) =>
              onChange('durabilidade_transmissao_km', v)
            }
            placeholder="Ex: 35000"
            icon={<Gauge size={18} color="#666" />}
            suffix="KM"
          />
        </View>
      </AccordionSection>
    );
  },
);
