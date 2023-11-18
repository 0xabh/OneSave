import { Web3Modal } from "utils/Web3ModalProvider";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AutoBalanceFetch from "@/components/AutoBalanceFetch.tsx";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Modal>
      <AutoBalanceFetch />
      <Component {...pageProps} />
    </Web3Modal>
  );
}
