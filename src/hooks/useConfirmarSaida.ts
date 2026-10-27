import { usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useConfirmarSaida(alterou: boolean) {
  const [liberado, setLiberado] = useState(false);

  const desativarBloqueio = usePreventRemove(alterou && !liberado, ({ repeat }) => {
    Alert.alert('Descartar alterações?', 'Os dados preenchidos serão perdidos.', [
      { text: 'Continuar editando', style: 'cancel' },
      {
        text: 'Descartar',
        style: 'destructive',
        onPress: () => {
          setLiberado(true);
          repeat();
        },
      },
    ]);
  });

  function liberarSaida() {
    setLiberado(true);
    desativarBloqueio();
  }

  function bloquearSaida() {
    setLiberado(false);
  }

  return { liberarSaida, bloquearSaida };
}
