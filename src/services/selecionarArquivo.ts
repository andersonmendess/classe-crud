import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export type ArquivoSelecionado = {
  uri: string;
  nome: string;
  mimeType: string | null;
};

export async function escolherArquivo(): Promise<ArquivoSelecionado | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ['image/*', 'application/pdf'],
    copyToCacheDirectory: true,
  });

  if (resultado.canceled || !resultado.assets) {
    return null;
  }

  const arquivo = resultado.assets[0];

  return {
    uri: arquivo.uri,
    nome: arquivo.name,
    mimeType: arquivo.mimeType ?? null,
  };
}

export async function tirarFoto(): Promise<ArquivoSelecionado | null> {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissao.granted) {
    throw new Error('Permissão da câmera negada. Libere o acesso nas configurações.');
  }

  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });

  if (resultado.canceled || !resultado.assets) {
    return null;
  }

  const foto = resultado.assets[0];

  return {
    uri: foto.uri,
    nome: foto.fileName ?? `foto-${Date.now()}.jpg`,
    mimeType: foto.mimeType ?? null,
  };
}
