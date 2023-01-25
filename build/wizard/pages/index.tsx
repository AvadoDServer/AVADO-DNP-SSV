import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { OperatorStatus } from '../components/OperatorStatus';
import { useOperatorId } from '../hooks/Operators';
import { RegisterOperator } from '../components/RegisterOperator';
import { DownloadBackup } from '../components/DownloadBackup';
import { RestoreBackup } from '../components/RestoreBackup';

const Home: NextPage = () => {

  const { isConnected, address } = useAccount()

  const { data: operatorId, error: error } = useOperatorId()

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

        <h1 className={styles.title}>Welcome to Avado SSV</h1>

        {error && (
          <>
            <div>Could not connect to your Avado</div>
            <div>({error.message})</div>
          </>
        )}

        {operatorId > 0 && (
          <>
            <OperatorStatus operatorId={operatorId} />
            <DownloadBackup />
          </>
        )}

        {operatorId === 0 && (
          <>
            {!isConnected && (
              <>
                <div>Click the <b>Connect Wallet</b> button below to connect to the wallet you want to use to register as SSV operator.</div>
              </>
            )}

            <ConnectButton />

            {!isConnected && (
              <>
                <div>Or restore a backup</div>
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
        )}
      </main>

      <footer className={styles.footer}>
        <a href="https://ava.do" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at Avado
        </a>
      </footer>
    </div>
  );
};

export default Home;
