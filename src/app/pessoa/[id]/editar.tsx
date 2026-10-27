import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { FormularioPessoa } from '@/components/FormularioPessoa';
import { cores } from '@/constants/cores';
import { listarDocumentos, salvarDocumentos, type Documento } from '@/database/documentos';
import {
  atualizarPessoa,
  buscarPessoa,
  cpfJaCadastrado,
  type DadosPessoa,
  type Pessoa,
} from '@/database/pessoas';
import { mostrarAviso } from '@/services/avisos';
import { ErroCadastro } from '@/utils/erros';

export default function TelaEditarPessoa() {
  const db = useSQLiteContext();
  const { id, etapa } = useLocalSearchParams<{ id: string; etapa?: string }>();
  const pessoaId = Number(id);

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([buscarPessoa(db, pessoaId), listarDocumentos(db, { tipo: 'pessoa', id: pessoaId })])
      .then(([encontrada, docs]) => {
        setPessoa(encontrada);
        setDocumentos(docs);
      })
      .catch(() => mostrarAviso('Não foi possível carregar a pessoa.'))
      .finally(() => setCarregando(false));
  }, [db, pessoaId]);

  async function handleSalvar(dados: DadosPessoa, documentosFinais: Documento[]) {
    if (await cpfJaCadastrado(db, dados.cpf, pessoaId)) {
      throw new ErroCadastro('Já existe uma pessoa cadastrada com este CPF.');
    }

    await atualizarPessoa(db, pessoaId, dados);
    await salvarDocumentos(db, { tipo: 'pessoa', id: pessoaId }, documentos, documentosFinais);
    mostrarAviso('Pessoa atualizada.');
    router.back();
  }

  if (carregando) {
    return <Text style={styles.mensagem}>Carregando...</Text>;
  }

  if (!pessoa) {
    return <Text style={styles.mensagem}>Pessoa não encontrada.</Text>;
  }

  return (
    <FormularioPessoa
      pessoa={pessoa}
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
