export type EnderecoCep = {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type RespostaViaCep = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoCep | null> {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  if (!resposta.ok) {
    throw new Error(`ViaCEP respondeu com status ${resposta.status}`);
  }

  const dados: RespostaViaCep = await resposta.json();

  if (dados.erro) {
    return null;
  }

  return {
    logradouro: dados.logradouro ?? '',
    bairro: dados.bairro ?? '',
    cidade: dados.localidade ?? '',
    uf: dados.uf ?? '',
  };
}
