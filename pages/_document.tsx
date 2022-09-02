import { createGetInitialProps } from '@mantine/next';
import Document, {
  Head, Html, Main, NextScript,
} from 'next/document';

const getInitialProps = createGetInitialProps();

export default class Gpt3Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
