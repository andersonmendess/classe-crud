import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { FormularioEmpresa } from '@/components/FormularioEmpresa';
import { salvarDocumentos, type Documento } from '@/database/documentos';
import { cnpjJaCadastrado, criarEmpresa, type DadosEmpresa } from '@/database/empresas';
import { mostrarAviso } from '@/services/avisos';
import { ErroCadastro } from '@/utils/erros';

export default function TelaNovaEmpresa() {
  const db = useSQLiteContext();

  async function handleSalvar(empresa: DadosEmpresa, documentos: Documento[]) {
    if (await cnpjJaCadastrado(db, empresa.cnpj)) {
      throw new ErroCadastro('Já existe uma empresa cadastrada com este CNPJ.');
    }

    const id = await criarEmpresa(db, empresa);
    await salvarDocumentos(db, { tipo: 'empresa', id }, [], documentos);
    mostrarAviso('Empresa salva.');
    router.back();
  }

  return <FormularioEmpresa onSalvar={handleSalvar} />;
}
