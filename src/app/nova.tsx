import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { FormularioPessoa } from '@/components/FormularioPessoa';
import { salvarDocumentos, type Documento } from '@/database/documentos';
import { cpfJaCadastrado, criarPessoa, type DadosPessoa } from '@/database/pessoas';
import { mostrarAviso } from '@/services/avisos';
import { ErroCadastro } from '@/utils/erros';

export default function TelaNovaPessoa() {
  const db = useSQLiteContext();

  async function handleSalvar(pessoa: DadosPessoa, documentos: Documento[]) {
    if (await cpfJaCadastrado(db, pessoa.cpf)) {
      throw new ErroCadastro('Já existe uma pessoa cadastrada com este CPF.');
    }

    const id = await criarPessoa(db, pessoa);
    await salvarDocumentos(db, { tipo: 'pessoa', id }, [], documentos);
    mostrarAviso('Pessoa salva.');
    router.back();
  }

  return <FormularioPessoa onSalvar={handleSalvar} />;
}
