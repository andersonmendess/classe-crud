import { Alert, Platform, ToastAndroid } from 'react-native';

export function mostrarAviso(mensagem: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(mensagem, ToastAndroid.SHORT);
    return;
  }

  Alert.alert(mensagem);
}
