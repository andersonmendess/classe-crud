import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CamposEndereco } from '@/components/CamposEndereco';
import { SecaoDocumentos } from '@/components/documentos/SecaoDocumentos';
import { EtapaDadosEmpresa } from '@/components/empresa/EtapaDadosEmpresa';
import { EtapaRevisaoEmpresa } from '@/components/empresa/EtapaRevisaoEmpresa';
import type { DadosFormularioEmpresa } from '@/components/empresa/tipos';
import { ProgressoEtapas } from '@/components/ProgressoEtapas';
import { cores } from '@/constants/cores';
import type { Documento } from '@/database/documentos';
import type { DadosEmpresa } from '@/database/empresas';
import { useConfirmarSaida } from '@/hooks/useConfirmarSaida';
import { useDocumentosFormulario } from '@/hooks/useDocumentosFormulario';
import { useFocoEncadeado } from '@/hooks/useFocoEncadeado';
import { mostrarAviso } from '@/services/avisos';
import { formatarCep, formatarCnpj, formatarCpf, formatarTelefone } from '@/utils/documentos';
import { ErroCadastro } from '@/utils/erros';
import { tiposDocumentoEmpresa } from '@/utils/tiposDocumento';
import { validarDadosEmpresa, validarEndereco, type Erros } from '@/utils/validacao';

const ETAPAS = ['Dados da empresa', 'Endereço', 'Documentos', 'Revisar'];

const ORDEM_CAMPOS = [
  'razaoSocial',
  'nomeFantasia',
  'cnpj',
  'email',
  'telefone',
  'representanteNome',
  'representanteCpf',
  'representanteCargo',
  'cep',
  'logradouro',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'uf',
];

type Props = {
  empresa?: DadosEmpresa;
  documentos?: Documento[];
  etapaInicial?: number;
  onSalvar: (empresa: DadosEmpresa, documentos: Documento[]) => void | Promise<void>;
};

export function FormularioEmpresa({
  empresa,
  documentos: documentosIniciais = [],
  etapaInicial = 1,
  onSalvar,
}: Props) {
  const insets = useSafeAreaInsets();
  const foco = useFocoEncadeado(ORDEM_CAMPOS);
  const [inicial] = useState(() => paraDadosFormulario(empresa));
  const [etapa, setEtapa] = useState(etapaInicial);
  const [dados, setDados] = useState<DadosFormularioEmpresa>(inicial);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const documentos = useDocumentosFormulario(documentosIniciais);

  const alterou =
    JSON.stringify(dados) !== JSON.stringify(inicial) ||
    JSON.stringify(documentos.documentos) !== JSON.stringify(documentosIniciais);
  const saida = useConfirmarSaida(alterou);

  function atualizar(campo: keyof DadosFormularioEmpresa, texto: string) {
    setDados((anterior) => ({ ...anterior, [campo]: texto }));
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
  }

  function irParaEtapa(numero: number) {
    setErros({});
    setEtapa(numero);
  }

  function avancar() {
    const novosErros = validarEtapa(etapa, dados);
    setErros(novosErros);

    if (Object.keys(novosErros).length === 0) {
      irParaEtapa(etapa + 1);
    }
  }

  async function salvar() {
    for (const numero of [1, 2]) {
      const novosErros = validarEtapa(numero, dados);

      if (Object.keys(novosErros).length > 0) {
        setErros(novosErros);
        setEtapa(numero);
        return;
      }
    }

    setSalvando(true);
    saida.liberarSaida();
    documentos.marcarComoSalvo(true);

    try {
      await onSalvar(montarEmpresa(dados), documentos.documentos);
    } catch (erro) {
      saida.bloquearSaida();
      documentos.marcarComoSalvo(false);
      setSalvando(false);
      mostrarAviso(
        erro instanceof ErroCadastro ? erro.message : 'Não foi possível salvar. Tente novamente.'
      );
    }
  }

  const ultimaEtapa = etapa === ETAPAS.length;

  return (
    <KeyboardAvoidingView style={styles.teclado} behavior="padding">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.conteudo, { paddingBottom: 16 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <ProgressoEtapas titulos={ETAPAS} atual={etapa} onIr={irParaEtapa} />
        <Text style={styles.tituloEtapa}>{ETAPAS[etapa - 1]}</Text>

        {etapa === 1 && (
          <EtapaDadosEmpresa dados={dados} erros={erros} onAlterar={atualizar} foco={foco} />
        )}
        {etapa === 2 && (
          <CamposEndereco dados={dados} erros={erros} onAlterar={atualizar} foco={foco} />
        )}
        {etapa === 3 && (
          <SecaoDocumentos
            tipos={tiposDocumentoEmpresa}
            documentos={documentos.documentos}
            onAdicionar={documentos.adicionar}
            onRemover={documentos.remover}
          />
        )}
        {etapa === 4 && (
          <EtapaRevisaoEmpresa
            dados={dados}
            documentos={documentos.documentos}
            onEditar={irParaEtapa}
          />
        )}

        <View style={styles.navegacao}>
          {etapa > 1 && (
            <Pressable style={styles.botaoVoltar} onPress={() => irParaEtapa(etapa - 1)}>
              <Text style={styles.textoBotaoVoltar}>Voltar</Text>
            </Pressable>
          )}
          <Pressable
            disabled={salvando}
            style={[styles.botaoPrincipal, salvando && styles.botaoDesabilitado]}
            onPress={ultimaEtapa ? salvar : avancar}>
            <Text style={styles.textoBotao}>
              {ultimaEtapa ? (salvando ? 'Salvando...' : 'Salvar') : 'Próximo'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function validarEtapa(numero: number, dados: DadosFormularioEmpresa): Erros {
  const empresa = montarEmpresa(dados);

  if (numero === 1) {
    return validarDadosEmpresa(empresa);
  }

  if (numero === 2) {
    return validarEndereco(empresa);
  }

  return {};
}

function montarEmpresa(dados: DadosFormularioEmpresa): DadosEmpresa {
  return {
    razaoSocial: dados.razaoSocial.trim(),
    nomeFantasia: dados.nomeFantasia.trim() || null,
    cnpj: dados.cnpj.replace(/[^A-Z0-9]/g, ''),
    email: dados.email.trim(),
    telefone: dados.telefone.replace(/\D/g, ''),
    representanteNome: dados.representanteNome.trim(),
    representanteCpf: dados.representanteCpf.replace(/\D/g, ''),
    representanteCargo: dados.representanteCargo.trim() || null,
    cep: dados.cep.replace(/\D/g, ''),
    logradouro: dados.logradouro.trim(),
    numero: dados.numero.trim(),
    complemento: dados.complemento.trim(),
    bairro: dados.bairro.trim(),
    cidade: dados.cidade.trim(),
    uf: dados.uf.trim().toUpperCase(),
  };
}

function paraDadosFormulario(empresa?: DadosEmpresa): DadosFormularioEmpresa {
  return {
    razaoSocial: empresa?.razaoSocial ?? '',
    nomeFantasia: empresa?.nomeFantasia ?? '',
    cnpj: formatarCnpj(empresa?.cnpj ?? ''),
    email: empresa?.email ?? '',
    telefone: formatarTelefone(empresa?.telefone ?? ''),
    representanteNome: empresa?.representanteNome ?? '',
    representanteCpf: formatarCpf(empresa?.representanteCpf ?? ''),
    representanteCargo: empresa?.representanteCargo ?? '',
    cep: formatarCep(empresa?.cep ?? ''),
    logradouro: empresa?.logradouro ?? '',
    numero: empresa?.numero ?? '',
    complemento: empresa?.complemento ?? '',
    bairro: empresa?.bairro ?? '',
    cidade: empresa?.cidade ?? '',
    uf: empresa?.uf ?? '',
  };
}

const styles = StyleSheet.create({
  teclado: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
    gap: 14,
  },
  tituloEtapa: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 4,
  },
  navegacao: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  botaoVoltar: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotaoVoltar: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: cores.primaria,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: cores.superficie,
    fontSize: 16,
    fontWeight: '600',
  },
});
