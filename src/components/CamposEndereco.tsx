import { useState } from 'react';

import { CampoTexto } from '@/components/CampoTexto';
import { buscarEnderecoPorCep } from '@/services/viacep';
import { formatarCep } from '@/utils/documentos';

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
  erros: Partial<Record<keyof DadosEndereco, string>>;
  onAlterar: (campo: keyof DadosEndereco, texto: string) => void;
};

export function CamposEndereco({ dados, erros, onAlterar }: Props) {
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
        label={buscandoCep ? 'CEP (buscando...)' : 'CEP'}
        value={dados.cep}
        onChangeText={handleCep}
        erro={erroCep ?? erros.cep}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="Logradouro"
        value={dados.logradouro}
        onChangeText={(texto) => onAlterar('logradouro', texto)}
        erro={erros.logradouro}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Número"
        value={dados.numero}
        onChangeText={(texto) => onAlterar('numero', texto)}
        erro={erros.numero}
      />
      <CampoTexto
        label="Complemento"
        value={dados.complemento}
        onChangeText={(texto) => onAlterar('complemento', texto)}
        erro={erros.complemento}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Bairro"
        value={dados.bairro}
        onChangeText={(texto) => onAlterar('bairro', texto)}
        erro={erros.bairro}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Cidade"
        value={dados.cidade}
        onChangeText={(texto) => onAlterar('cidade', texto)}
        erro={erros.cidade}
        autoCapitalize="words"
      />
      <CampoTexto
        label="UF"
        value={dados.uf}
        onChangeText={(texto) => onAlterar('uf', texto)}
        erro={erros.uf}
      />
    </>
  );
}
