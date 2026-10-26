import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

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
        style={styles.input}
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
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000000',
  },
  erro: {
    color: '#D00000',
    fontSize: 13,
  },
});
