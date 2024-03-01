import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { OperatorInfo } from '../components/OperatorInfo';
// import { DownloadBackup } from '../components/DownloadBackup';
// import { RestoreBackup } from '../components/RestoreBackup';
import { useNetwork, useOperatorPublicKey } from '../hooks/read/useMonitor';
import { DownloadBackup } from '../components/DownloadBackup';

const Home: NextPage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(true), []);

  // const { isConnected, address, status } = useAccount()

  const { data: operatorPubKey, error: error } = useOperatorPublicKey();
  const { data: network, error: network_error } = useNetwork();

  console.log("operatorPubKey", operatorPubKey)
  console.log("network", network)

  if (!isReady) return null;

  if (error) {
    return (
      <>
        <div>Could not connect to your Avado</div>
        <div>({error.message})</div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Avado SSV</title>
        <meta
          name="Avado SSV package"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        {error && (
          <>
            <div>Could not connect to your Avado</div>
            <div>({error.message})</div>
          </>
        )}

        {operatorPubKey && (
          <>
            <OperatorInfo operatorPubKey={operatorPubKey} network={network} />
            <DownloadBackup />
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a href="http://my.ava.do/#/Packages/ssv.avado.dappnode.eth/detail">Logs</a>
        <br />
        <a href="https://ava.do" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at Avado
        </a>
      </footer>
    </div>
  );
};

export default Home;
