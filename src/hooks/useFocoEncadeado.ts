import { useRef } from 'react';
import { Keyboard, type TextInputInstance } from 'react-native';

export type FocoEncadeado = {
  registrar: (campo: string) => (elemento: TextInputInstance | null) => void;
  aoEnviar: (campo: string) => void;
};

export function useFocoEncadeado(ordem: string[]): FocoEncadeado {
  const campos = useRef<Record<string, TextInputInstance | null>>({});

  function registrar(campo: string) {
    return (elemento: TextInputInstance | null) => {
      campos.current[campo] = elemento;
    };
  }

  function aoEnviar(campo: string) {
    for (let indice = ordem.indexOf(campo) + 1; indice < ordem.length; indice++) {
      const proximo = campos.current[ordem[indice]];

      if (proximo) {
        proximo.focus();
        return;
      }
    }

    Keyboard.dismiss();
  }

  return { registrar, aoEnviar };
}
