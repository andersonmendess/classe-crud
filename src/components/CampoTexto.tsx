import { ActivityIndicator, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { cores } from '@/constants/cores';
import type { FocoEncadeado } from '@/hooks/useFocoEncadeado';

type Props = {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  erro?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'words';
  carregando?: boolean;
  foco?: FocoEncadeado;
  campo?: string;
};

export function CampoTexto({
  label,
  value,
  onChangeText,
  erro,
  keyboardType,
  autoCapitalize = 'none',
  carregando = false,
  foco,
  campo,
}: Props) {
  return (
    <View style={styles.campo}>
      <View style={styles.cabecalho}>
        <Text style={styles.label}>{label}</Text>
        {carregando ? <ActivityIndicator size="small" color={cores.primaria} /> : null}
      </View>
      <TextInput
        ref={foco && campo ? foco.registrar(campo) : undefined}
        style={[styles.input, erro && styles.inputComErro]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => {
          if (foco && campo) {
            foco.aoEnviar(campo);
          }
        }}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    gap: 6,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.texto,
  },
  input: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
  },
  inputComErro: {
    borderColor: cores.erro,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
  },
});
