import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/CampoTexto';
import type { DadosPessoa } from '@/database/pessoas';
import { buscarEnderecoPorCep } from '@/services/viacep';
import { dataBrParaIso, formatarDataBr, isoParaDataBr } from '@/utils/data';
import { formatarCep, formatarCpf } from '@/utils/documentos';
import { validarPessoa, type ErrosPessoa } from '@/utils/validacao';

type DadosFormulario = {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type Props = {
  pessoa?: DadosPessoa;
  onSalvar: (pessoa: DadosPessoa) => void;
};

export function FormularioPessoa({ pessoa, onSalvar }: Props) {
  const insets = useSafeAreaInsets();
  const [dados, setDados] = useState<DadosFormulario>(() => paraDadosFormulario(pessoa));
  const [erros, setErros] = useState<ErrosPessoa>({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  function atualizar(campo: keyof DadosFormulario, texto: string) {
    setDados((anterior) => ({ ...anterior, [campo]: texto }));
  }

  async function handleCep(texto: string) {
    const cep = formatarCep(texto);
    atualizar('cep', cep);

    const numeros = cep.replace(/\D/g, '');
    if (numeros.length !== 8) {
      return;
    }

    setBuscandoCep(true);
    try {
      const endereco = await buscarEnderecoPorCep(numeros);

      if (endereco) {
        setDados((dados) => ({ ...dados, ...endereco }));
        setErros((erros) => ({ ...erros, cep: undefined }));
      } else {
        setErros((erros) => ({ ...erros, cep: 'CEP não encontrado.' }));
      }
    } catch {
      setErros((erros) => ({
        ...erros,
        cep: 'Não foi possível buscar o CEP. Verifique sua conexão.',
      }));
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleSalvar() {
    const dataIso = dataBrParaIso(dados.dataNascimento);

    const pessoaNova: DadosPessoa = {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      dataNascimento: dataIso ?? '',
      cpf: dados.cpf.replace(/\D/g, ''),
      rg: dados.rg.trim() || null,
      cep: dados.cep.replace(/\D/g, ''),
      logradouro: dados.logradouro.trim(),
      numero: dados.numero.trim(),
      complemento: dados.complemento.trim(),
      bairro: dados.bairro.trim(),
      cidade: dados.cidade.trim(),
      uf: dados.uf.trim().toUpperCase(),
    };

    const novosErros = validarPessoa(pessoaNova);
    if (dados.dataNascimento && !dataIso) {
      novosErros.dataNascimento = 'Data inválida. Use DD/MM/AAAA.';
    }
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      onSalvar(pessoaNova);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Dados pessoais</Text>

      <CampoTexto
        label="Nome"
        value={dados.nome}
        onChangeText={(texto) => atualizar('nome', texto)}
        erro={erros.nome}
        autoCapitalize="words"
      />
      <CampoTexto
        label="E-mail"
        value={dados.email}
        onChangeText={(texto) => atualizar('email', texto)}
        erro={erros.email}
        keyboardType="email-address"
      />
      <CampoTexto
        label="Telefone"
        value={dados.telefone}
        onChangeText={(texto) => atualizar('telefone', texto)}
        erro={erros.telefone}
        keyboardType="phone-pad"
      />
      <CampoTexto
        label="Data de nascimento (DD/MM/AAAA)"
        value={dados.dataNascimento}
        onChangeText={(texto) => atualizar('dataNascimento', formatarDataBr(texto))}
        erro={erros.dataNascimento}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="CPF"
        value={dados.cpf}
        onChangeText={(texto) => atualizar('cpf', formatarCpf(texto))}
        erro={erros.cpf}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="RG (opcional)"
        value={dados.rg}
        onChangeText={(texto) => atualizar('rg', texto)}
      />

      <Text style={styles.titulo}>Endereço</Text>

      <CampoTexto
        label={buscandoCep ? 'CEP (buscando...)' : 'CEP'}
        value={dados.cep}
        onChangeText={handleCep}
        erro={erros.cep}
        keyboardType="number-pad"
      />
      <CampoTexto
        label="Logradouro"
        value={dados.logradouro}
        onChangeText={(texto) => atualizar('logradouro', texto)}
        erro={erros.logradouro}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Número"
        value={dados.numero}
        onChangeText={(texto) => atualizar('numero', texto)}
        erro={erros.numero}
      />
      <CampoTexto
        label="Complemento"
        value={dados.complemento}
        onChangeText={(texto) => atualizar('complemento', texto)}
        erro={erros.complemento}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Bairro"
        value={dados.bairro}
        onChangeText={(texto) => atualizar('bairro', texto)}
        erro={erros.bairro}
        autoCapitalize="words"
      />
      <CampoTexto
        label="Cidade"
        value={dados.cidade}
        onChangeText={(texto) => atualizar('cidade', texto)}
        erro={erros.cidade}
        autoCapitalize="words"
      />
      <CampoTexto
        label="UF"
        value={dados.uf}
        onChangeText={(texto) => atualizar('uf', texto)}
        erro={erros.uf}
      />

      <Pressable style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}

function paraDadosFormulario(pessoa?: DadosPessoa): DadosFormulario {
  return {
    nome: pessoa?.nome ?? '',
    email: pessoa?.email ?? '',
    telefone: pessoa?.telefone ?? '',
    dataNascimento: pessoa ? isoParaDataBr(pessoa.dataNascimento) : '',
    cpf: pessoa ? formatarCpf(pessoa.cpf) : '',
    rg: pessoa?.rg ?? '',
    cep: pessoa ? formatarCep(pessoa.cep) : '',
    logradouro: pessoa?.logradouro ?? '',
    numero: pessoa?.numero ?? '',
    complemento: pessoa?.complemento ?? '',
    bairro: pessoa?.bairro ?? '',
    cidade: pessoa?.cidade ?? '',
    uf: pessoa?.uf ?? '',
  };
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 16,
    gap: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  botaoSalvar: {
    backgroundColor: '#208AEF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
