import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { OperatorInfo } from '../components/OperatorInfo';
// import { DownloadBackup } from '../components/DownloadBackup';
// import { RestoreBackup } from '../components/RestoreBackup';
import { useOperatorPublicKey } from '../hooks/read/useMonitor';

const Home: NextPage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(true), []);

  // const { isConnected, address, status } = useAccount()

  const { data: operatorPubKey, error: error } = useOperatorPublicKey();

  // console.log("operatorPubKey", operatorPubKey)

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
            <OperatorInfo operatorPubKey={`${operatorPubKey}`} />
            {/* <SsvButtons operatorPubKey={operatorPubKey} /> */}
            {/* <DownloadBackup /> */}
          </>
        )}


        {/* {(!operatorPubKey) && (
          <>
            <h1 className="title is-1">Welcome to Avado SSV</h1>
            {!isConnected && (
              <>
                <div>Click the <b>Connect Wallet</b> button below to connect to the wallet you want to use to register as SSV operator.</div>
              </>
            )}

            <ConnectButton />

            {!isConnected && (
              <>
                <RestoreBackup />
              </>
            )}

            {isConnected && (
              <>
                <div>The next step is registring your node on the SSV smart contract.</div>
                <div>Choose an operator name, click <b>Register</b> and confirm the transaction in your wallet.</div>
                <RegisterOperator address={address} />
              </>
            )}
          </>
        )} */}
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
