import {
  AppShell, Header, Title,
} from '@mantine/core';
import React from 'react';
import AppNavbar from './navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      navbar={<AppNavbar />}
      header={(
        <Header height={40} p="xs">
          <Title order={4} sx={{ verticalAlign: 'middle', lineHeight: '100%' }}>GPT-3 Demo</Title>
        </Header>
)}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      { children }
    </AppShell>
  );
}
