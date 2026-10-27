import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { criarTabelas } from '@/database/criar-tabelas';
import { cores } from '@/constants/cores';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="classe.db" onInit={criarTabelas}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.superficie,
          headerTitleStyle: { color: cores.superficie },
        }}>
        <Stack.Screen name="index" options={{ title: 'Cadastros' }} />
        <Stack.Screen name="nova" options={{ title: 'Nova pessoa' }} />
        <Stack.Screen name="nova-empresa" options={{ title: 'Nova empresa' }} />
        <Stack.Screen name="pessoa/[id]/index" options={{ title: 'Pessoa' }} />
        <Stack.Screen name="pessoa/[id]/editar" options={{ title: 'Editar pessoa' }} />
        <Stack.Screen name="empresa/[id]/index" options={{ title: 'Empresa' }} />
        <Stack.Screen name="empresa/[id]/editar" options={{ title: 'Editar empresa' }} />
      </Stack>
    </SQLiteProvider>
  );
}
