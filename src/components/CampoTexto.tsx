import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { cores } from '@/constants/cores';

type Props = {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  erro?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'words';
};

export function CampoTexto({
  label,
  value,
  onChangeText,
  erro,
  keyboardType,
  autoCapitalize = 'none',
}: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro && styles.inputComErro]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    gap: 6,
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
