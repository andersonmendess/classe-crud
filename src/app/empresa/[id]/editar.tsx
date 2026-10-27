import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { FormularioEmpresa } from '@/components/FormularioEmpresa';
import { cores } from '@/constants/cores';
import { listarDocumentos, salvarDocumentos, type Documento } from '@/database/documentos';
import {
  atualizarEmpresa,
  buscarEmpresa,
  cnpjJaCadastrado,
  type DadosEmpresa,
  type Empresa,
} from '@/database/empresas';
import { mostrarAviso } from '@/services/avisos';
import { ErroCadastro } from '@/utils/erros';

export default function TelaEditarEmpresa() {
  const db = useSQLiteContext();
  const { id, etapa } = useLocalSearchParams<{ id: string; etapa?: string }>();
  const empresaId = Number(id);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([buscarEmpresa(db, empresaId), listarDocumentos(db, { tipo: 'empresa', id: empresaId })])
      .then(([encontrada, docs]) => {
        setEmpresa(encontrada);
        setDocumentos(docs);
      })
      .catch(() => mostrarAviso('Não foi possível carregar a empresa.'))
      .finally(() => setCarregando(false));
  }, [db, empresaId]);

  async function handleSalvar(dados: DadosEmpresa, documentosFinais: Documento[]) {
    if (await cnpjJaCadastrado(db, dados.cnpj, empresaId)) {
      throw new ErroCadastro('Já existe uma empresa cadastrada com este CNPJ.');
    }

    await atualizarEmpresa(db, empresaId, dados);
    await salvarDocumentos(db, { tipo: 'empresa', id: empresaId }, documentos, documentosFinais);
    mostrarAviso('Empresa atualizada.');
    router.back();
  }

  if (carregando) {
    return <Text style={styles.mensagem}>Carregando...</Text>;
  }

  if (!empresa) {
    return <Text style={styles.mensagem}>Empresa não encontrada.</Text>;
  }

  return (
    <FormularioEmpresa
      empresa={empresa}
      documentos={documentos}
      etapaInicial={Number(etapa) || 1}
      onSalvar={handleSalvar}
    />
  );
}

const styles = StyleSheet.create({
  mensagem: {
    padding: 16,
    color: cores.texto,
  },
});
