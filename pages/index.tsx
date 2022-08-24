import { AppShell, Header, Navbar } from '@mantine/core'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return <AppShell
    padding="md"
    navbar={<Navbar width={{ base: 250 }} height={500} p="xs">{/* Navbar content */}</Navbar>}
    header={<Header height={40} p="xs">{/* Header content */}</Header>}
    styles={(theme) => ({
      main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    {/* Your application here */}
  </AppShell>
}

export default Home
