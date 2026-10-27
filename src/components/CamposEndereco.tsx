import { useState } from 'react';

import { CampoTexto } from '@/components/CampoTexto';
import type { FocoEncadeado } from '@/hooks/useFocoEncadeado';
import { buscarEnderecoPorCep } from '@/services/viacep';
import { formatarCep } from '@/utils/documentos';
import type { Erros } from '@/utils/validacao';

export type DadosEndereco = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type Props = {
  dados: DadosEndereco;
  erros: Erros;
  onAlterar: (campo: keyof DadosEndereco, texto: string) => void;
  foco: FocoEncadeado;
};

export function CamposEndereco({ dados, erros, onAlterar, foco }: Props) {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState<string>();

  async function handleCep(texto: string) {
    const cep = formatarCep(texto);
    onAlterar('cep', cep);
    setErroCep(undefined);

    const numeros = cep.replace(/\D/g, '');
    if (numeros.length !== 8) {
      return;
    }

    setBuscandoCep(true);
    try {
      const endereco = await buscarEnderecoPorCep(numeros);

      if (endereco) {
        onAlterar('logradouro', endereco.logradouro);
        onAlterar('bairro', endereco.bairro);
        onAlterar('cidade', endereco.cidade);
        onAlterar('uf', endereco.uf);
      } else {
        setErroCep('CEP não encontrado.');
      }
    } catch {
      setErroCep('Não foi possível buscar o CEP. Verifique sua conexão.');
    } finally {
      setBuscandoCep(false);
    }
  }

  return (
    <>
      <CampoTexto
        label="CEP"
        value={dados.cep}
        onChangeText={handleCep}
        erro={erroCep ?? erros.cep}
        keyboardType="number-pad"
        carregando={buscandoCep}
        foco={foco}
        campo="cep"
      />
      <CampoTexto
        label="Logradouro"
        value={dados.logradouro}
        onChangeText={(texto) => onAlterar('logradouro', texto)}
        erro={erros.logradouro}
        autoCapitalize="words"
        foco={foco}
        campo="logradouro"
      />
      <CampoTexto
        label="Número"
        value={dados.numero}
        onChangeText={(texto) => onAlterar('numero', texto)}
        erro={erros.numero}
        foco={foco}
        campo="numero"
      />
      <CampoTexto
        label="Complemento (opcional)"
        value={dados.complemento}
        onChangeText={(texto) => onAlterar('complemento', texto)}
        erro={erros.complemento}
        autoCapitalize="words"
        foco={foco}
        campo="complemento"
      />
      <CampoTexto
        label="Bairro"
        value={dados.bairro}
        onChangeText={(texto) => onAlterar('bairro', texto)}
        erro={erros.bairro}
        autoCapitalize="words"
        foco={foco}
        campo="bairro"
      />
      <CampoTexto
        label="Cidade"
        value={dados.cidade}
        onChangeText={(texto) => onAlterar('cidade', texto)}
        erro={erros.cidade}
        autoCapitalize="words"
        foco={foco}
        campo="cidade"
      />
      <CampoTexto
        label="UF"
        value={dados.uf}
        onChangeText={(texto) => onAlterar('uf', texto)}
        erro={erros.uf}
        foco={foco}
        campo="uf"
      />
    </>
  );
}
