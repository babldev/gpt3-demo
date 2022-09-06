import {
  Box, Group, Navbar, Stack, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core';
import {
  IconBrandHipchat, IconMoodSmileBeam, IconMovie, IconPig, IconSettings, IconStar,
} from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

// Add your pages here!
const productExamples = [
  {
    icon: <IconMovie size={16} />,
    label: 'Movie to emoji',
    sublabel: 'Knowledge',
    path: 'movie-to-emoji',
  },
  {
    icon: <IconBrandHipchat size={16} />,
    label: 'Chatbot',
    sublabel: 'Conversation',
    path: 'chatbot',
  },
  {
    icon: <IconMoodSmileBeam size={16} />,
    label: 'Tweet sentiment classifier',
    sublabel: 'Classification',
    path: 'tweet-sentiment-classifier',
  },
  {
    icon: <IconPig size={16} />,
    label: 'Pig latin translator',
    sublabel: 'Translation',
    path: 'pig-latin',
  },
  {
    icon: <IconStar size={16} />,
    label: 'Fake review generator',
    sublabel: 'Generation',
    path: 'fake-review-generator',
  },
];

const paramExamples = [
  { icon: <IconSettings size={16} />, label: 'temperature', path: 'temperature' },
  { icon: <IconSettings size={16} />, label: 'top_p', path: 'top-p' },
];

interface MainLinkProps {
  icon: React.ReactNode;
  path: string;
  color?: string;
  label: string;
  sublabel?: string;
}

function MainLink({
  icon, color, label, path, sublabel,
}: MainLinkProps) {
  const router = useRouter();
  const linkPath = `/demos/${path}`;
  const currentPath = router.pathname === linkPath;
  return (
    <Link href={linkPath} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: 6,
          borderRadius: theme.radius.sm,
          color: theme.black,
          backgroundColor: currentPath ? theme.colors.blue[1] : undefined,
          '&:hover': {
            backgroundColor: theme.colors.blue[2],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light" size="sm">
            {icon}
          </ThemeIcon>

          <Box>
            <Text size="xs">{label}</Text>
            { sublabel && <Text size={10} color="dimmed" transform="uppercase">{ sublabel }</Text>}
          </Box>
        </Group>
      </UnstyledButton>
    </Link>
  );
}
MainLink.defaultProps = {
  color: undefined,
  sublabel: undefined,
};

export default function AppNavbar() {
  return (
    <Navbar width={{ base: 250 }} height="100%" p={6}>
      <Stack>
        <Box>
          <Text size="sm" weight="bold">Use cases</Text>
          { productExamples.map((link) => <MainLink {...link} key={link.label} />) }
        </Box>
        <Box>
          <Text size="sm" weight="bold">Parameters</Text>
          { paramExamples.map((link) => <MainLink {...link} key={link.label} />) }
        </Box>
      </Stack>
    </Navbar>
  );
}
