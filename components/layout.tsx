import {
  AppShell, Group, Header, Navbar, Text, ThemeIcon, Title, UnstyledButton,
} from '@mantine/core';
import {
  IconAlertCircle, IconDatabase, IconGitPullRequest, IconMessages,
} from '@tabler/icons';
import React from 'react';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
}

function MainLink({ icon, color, label }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: 6,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light" size="sm">
          {icon}
        </ThemeIcon>

        <Text size="xs">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <IconGitPullRequest size={16} />, color: 'blue', label: 'Pull Requests' },
  { icon: <IconAlertCircle size={16} />, color: 'teal', label: 'Open Issues' },
  { icon: <IconMessages size={16} />, color: 'violet', label: 'Discussions' },
  { icon: <IconDatabase size={16} />, color: 'grape', label: 'Databases' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      navbar={(
        <Navbar width={{ base: 250 }} height="100%" p={6}>
          <MainLinks />
        </Navbar>
)}
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
