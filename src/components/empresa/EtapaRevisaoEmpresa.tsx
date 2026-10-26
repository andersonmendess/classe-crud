import { CartaoResumo, LinhaResumo } from '@/components/CartaoResumo';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';

type Props = {
  dados: DadosFormularioEmpresa;
  onEditar: (etapa: number) => void;
};

export function EtapaRevisaoEmpresa({ dados, onEditar }: Props) {
  return (
    <>
      <CartaoResumo titulo="Dados da empresa" onEditar={() => onEditar(1)}>
        <LinhaResumo rotulo="Razão social" valor={dados.razaoSocial} />
        <LinhaResumo rotulo="Nome fantasia" valor={dados.nomeFantasia} />
        <LinhaResumo rotulo="CNPJ" valor={dados.cnpj} />
        <LinhaResumo rotulo="E-mail" valor={dados.email} />
        <LinhaResumo rotulo="Telefone" valor={dados.telefone} />
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
    </>
  );
}
