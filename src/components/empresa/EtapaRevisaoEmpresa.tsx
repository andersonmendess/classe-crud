import { CartaoResumo, LinhaResumo } from '@/components/CartaoResumo';
import { CartaoDocumentos } from '@/components/documentos/CartaoDocumentos';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';
import type { Documento } from '@/database/documentos';
import { tiposDocumentoEmpresa } from '@/utils/tiposDocumento';

type Props = {
  dados: DadosFormularioEmpresa;
  documentos: Documento[];
  onEditar: (etapa: number) => void;
};

export function EtapaRevisaoEmpresa({ dados, documentos, onEditar }: Props) {
  return (
    <>
      <CartaoResumo titulo="Dados da empresa" onEditar={() => onEditar(1)}>
        <LinhaResumo rotulo="Razão social" valor={dados.razaoSocial} />
        <LinhaResumo rotulo="Nome fantasia" valor={dados.nomeFantasia} />
        <LinhaResumo rotulo="CNPJ" valor={dados.cnpj} />
        <LinhaResumo rotulo="E-mail" valor={dados.email} />
        <LinhaResumo rotulo="Telefone" valor={dados.telefone} />
      </CartaoResumo>

      <CartaoResumo titulo="Representante legal" onEditar={() => onEditar(1)}>
        <LinhaResumo rotulo="Nome" valor={dados.representanteNome} />
        <LinhaResumo rotulo="CPF" valor={dados.representanteCpf} />
        <LinhaResumo rotulo="Cargo" valor={dados.representanteCargo} />
      </CartaoResumo>

      <CartaoResumo titulo="Endereço" onEditar={() => onEditar(2)}>
        <LinhaResumo rotulo="CEP" valor={dados.cep} />
        <LinhaResumo rotulo="Logradouro" valor={dados.logradouro} />
        <LinhaResumo rotulo="Número" valor={dados.numero} />
        <LinhaResumo rotulo="Complemento" valor={dados.complemento} />
        <LinhaResumo rotulo="Bairro" valor={dados.bairro} />
        <LinhaResumo rotulo="Cidade" valor={dados.cidade} />
        <LinhaResumo rotulo="UF" valor={dados.uf} />
      </CartaoResumo>

      <CartaoDocumentos
        documentos={documentos}
        tipos={tiposDocumentoEmpresa}
        onEditar={() => onEditar(3)}
      />
    </>
  );
}
