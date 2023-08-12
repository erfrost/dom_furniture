import Head from "next/head";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Общие теги <head> */}
        <title>Мой сайт</title>
        <meta name="description" content="Описание моего сайта" />
        <link rel="icon" href="/favicon.ico" />

        {/* <script src="//code.jivo.ru/widget/fo3JcgKaha" async></script> */}
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
