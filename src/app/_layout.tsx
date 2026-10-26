import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { criarTabelas } from '@/database/criar-tabelas';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="classe.db" onInit={criarTabelas}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Cadastros' }} />
        <Stack.Screen name="nova" options={{ title: 'Nova pessoa' }} />
        <Stack.Screen name="nova-empresa" options={{ title: 'Nova empresa' }} />
        <Stack.Screen name="[id]" options={{ title: 'Editar pessoa' }} />
      </Stack>
    </SQLiteProvider>
  );
}
