import {
  Group, Navbar, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core';
import {
  IconMovie, IconPig,
} from '@tabler/icons';
import Link from 'next/link';
import React from 'react';

// Add your pages here!
const data = [
  { icon: <IconMovie size={16} />, label: 'Movie to emoji', path: 'movie-to-emoji' },
  { icon: <IconPig size={16} />, label: 'Pig latin translator', path: 'pig-latin' },
];
interface MainLinkProps {
  icon: React.ReactNode;
  path: string;
  color?: string;
  label: string;
}

function MainLink({
  icon, color, label, path,
}: MainLinkProps) {
  return (
    <Link href={`/demos/${path}`} passHref>
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
    </Link>
  );
}
MainLink.defaultProps = {
  color: undefined,
};

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}

export default function AppNavbar() {
  return (
    <Navbar width={{ base: 250 }} height="100%" p={6}>
      <MainLinks />
    </Navbar>
  );
}
