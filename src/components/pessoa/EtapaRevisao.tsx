import { CartaoResumo, LinhaResumo } from '@/components/CartaoResumo';
import type { DadosFormularioPessoa } from '@/components/pessoa/tipos';

type Props = {
  dados: DadosFormularioPessoa;
  onEditar: (etapa: number) => void;
};

export function EtapaRevisao({ dados, onEditar }: Props) {
  return (
    <>
      <CartaoResumo titulo="Dados pessoais" onEditar={() => onEditar(1)}>
        <LinhaResumo rotulo="Nome" valor={dados.nome} />
        <LinhaResumo rotulo="E-mail" valor={dados.email} />
        <LinhaResumo rotulo="Telefone" valor={dados.telefone} />
        <LinhaResumo rotulo="Nascimento" valor={dados.dataNascimento} />
        <LinhaResumo rotulo="CPF" valor={dados.cpf} />
        <LinhaResumo rotulo="RG" valor={dados.rg} />
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
