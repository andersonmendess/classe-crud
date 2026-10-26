import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { FormularioPessoa } from '@/components/FormularioPessoa';
import { criarPessoa, type DadosPessoa } from '@/database/pessoas';

export default function TelaNovaPessoa() {
  const db = useSQLiteContext();

  async function handleSalvar(dados: DadosPessoa) {
    await criarPessoa(db, dados);
    router.back();
  }

  return <FormularioPessoa onSalvar={handleSalvar} />;
}
