import { useEffect, useRef, useState } from 'react';

import type { Documento } from '@/database/documentos';
import { apagarArquivo } from '@/services/arquivos';

export function useDocumentosFormulario(iniciais: Documento[]) {
  const [documentos, setDocumentos] = useState(iniciais);
  const novosCaminhos = useRef<string[]>([]);
  const salvou = useRef(false);

  useEffect(() => {
    return () => {
      if (!salvou.current) {
        novosCaminhos.current.forEach(apagarArquivo);
      }
    };
  }, []);

  function adicionar(documento: Documento) {
    novosCaminhos.current.push(documento.caminho);
    setDocumentos((anteriores) => [...anteriores, documento]);
  }

  function remover(documento: Documento) {
    setDocumentos((anteriores) => anteriores.filter((d) => d.caminho !== documento.caminho));

    if (documento.id === undefined) {
      novosCaminhos.current = novosCaminhos.current.filter((caminho) => caminho !== documento.caminho);
      apagarArquivo(documento.caminho);
    }
  }

  function marcarComoSalvo(salvo: boolean) {
    salvou.current = salvo;
  }

  return { documentos, adicionar, remover, marcarComoSalvo };
}
