import { StyleSheet, Text, View } from 'react-native';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <Text>Nenhum cadastrado ainda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
