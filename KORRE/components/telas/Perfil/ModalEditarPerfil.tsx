import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bike, Car, Save, Trash2, X } from 'lucide-react-native';
import { useEditarPerfil } from '../../../hooks/perfil_user/useEditarPerfil';
import { useTema } from '../../../hooks/modo_tema';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/Perfil/ModalEditarPerfilInlineStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/Perfil/ModalEditarPerfilDynamicStyles';

interface Props {
  visivel: boolean;
  onClose: () => void;
  onSalvoSucesso: () => void;
}

export const ModalEditarPerfil = ({
  visivel,
  onClose,
  onSalvoSucesso,
}: Props) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    nome,
    setNome,
    senha,
    setSenha,
    tipoMeta,
    setTipoMeta,
    veiculos,
    loading,
    salvarDados,
    apagarVeiculo,
  } = useEditarPerfil(visivel, onClose, onSalvoSucesso);

  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';
  const borderColor = isDark ? '#333' : '#E0E0E0';
  const inputBg = isDark ? '#0A0A0A' : '#F5F5F5';

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
    >
      <View style={inlineStyles.inline1}>
        <View
          style={dynamicInlineStyles.inline1({ bgColor })}
        >
          <View style={inlineStyles.inline2}>
            <Text
              style={dynamicInlineStyles.inline2({ textColor })}
            >
              {t('perfil.editar_dados')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={dynamicInlineStyles.inline3({ inputBg })}
            >
              <X
                size={20}
                color={isDark ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={inlineStyles.inline3}>
              {t('perfil.dados_pessoais')}
            </Text>
            <TextInput
              style={dynamicInlineStyles.inline4({
                inputBg,
                textColor,
                borderColor,
              })}
              value={nome}
              onChangeText={setNome}
              placeholder={t('perfil.editar_nome_placeholder')}
              placeholderTextColor="#666"
            />
            <TextInput
              style={dynamicInlineStyles.inline5({
                inputBg,
                textColor,
                borderColor,
              })}
              value={senha}
              onChangeText={setSenha}
              placeholder={t('perfil.nova_senha_placeholder')}
              placeholderTextColor="#666"
              secureTextEntry
            />

            <Text style={inlineStyles.inline4}>
              {t('perfil.tipo_meta_financeira')}
            </Text>
            <View
              style={dynamicInlineStyles.inline6({
                inputBg,
                borderColor,
              })}
            >
              <TouchableOpacity
                onPress={() => setTipoMeta('diaria')}
                style={dynamicInlineStyles.inline7({ tipoMeta })}
              >
                <Text
                  style={dynamicInlineStyles.inline8({ tipoMeta })}
                >
                  {t('perfil.diaria')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTipoMeta('semanal')}
                style={dynamicInlineStyles.inline9({ tipoMeta })}
              >
                <Text
                  style={dynamicInlineStyles.inline10({ tipoMeta })}
                >
                  {t('perfil.semanal')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={inlineStyles.inline5}>
              {t('perfil.gerir_veiculos')}
            </Text>
            {veiculos.length === 0 ? (
              <Text style={inlineStyles.inline6}>
                {t('perfil.nenhum_veiculo_cadastrado')}
              </Text>
            ) : (
              veiculos.map((v) => (
                <View
                  key={v.id}
                  style={dynamicInlineStyles.inline11({
                    inputBg,
                    borderColor,
                  })}
                >
                  <View style={inlineStyles.inline7}>
                    {v.tipo === 'carro' ? (
                      <Car size={20} color={textColor} />
                    ) : (
                      <Bike size={20} color={textColor} />
                    )}
                    <View>
                      <Text
                        style={dynamicInlineStyles.inline12({
                          textColor,
                        })}
                      >
                        {v.modelo}
                      </Text>
                      <Text style={inlineStyles.inline8}>
                        {v.placa}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      apagarVeiculo(v.id, v.modelo)
                    }
                    style={inlineStyles.inline9}
                  >
                    <Trash2 size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={salvarDados}
            disabled={loading}
            style={dynamicInlineStyles.inline13({ loading })}
          >
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Save size={20} color="#0A0A0A" />
            )}
            <Text style={inlineStyles.inline10}>
              {t('perfil.salvar_alteracoes')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
