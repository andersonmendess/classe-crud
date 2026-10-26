import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { FormularioEmpresa } from '@/components/FormularioEmpresa';
import { criarEmpresa, type DadosEmpresa } from '@/database/empresas';

export default function TelaNovaEmpresa() {
  const db = useSQLiteContext();

  async function handleSalvar(empresa: DadosEmpresa) {
    await criarEmpresa(db, empresa);
    router.back();
  }

  return <FormularioEmpresa onSalvar={handleSalvar} />;
}
