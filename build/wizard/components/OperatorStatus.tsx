import styles from '../styles/Home.module.css';
import Web3 from 'web3';
import { BigNumber, utils } from 'ethers';
import { useAddressBalance } from '../hooks/read/useAddressBalance';
import { useOperatorStatus } from '../hooks/Operators';
import { useOperatorById } from '../hooks/read/useOperatorById';

const web3 = new Web3();

export const OperatorStatus = ({ operatorId }: { operatorId: number }) => {

    const { data: operator, error: errorOperator } = useOperatorById(operatorId)
    const { data: addressBalance, error: errorAddressBalance, isLoading: isLoadingAddressBalance } = useAddressBalance(operator?.ownerAddress)
    const { data: operatorApiStatus, error: errorOperatorApi } = useOperatorStatus({ operatorId })

    const displayBalance = (addressBalance: any) => {
        const balance = addressBalance as BigNumber;
        return web3.utils.fromWei(balance?.toString()) + " SSV"
    }

    const displayPercentage = (performance: any) => {
        const perf = performance as number;
        return perf.toFixed(2) + "%"
    }

    return (
        <div>
            <h2 className={styles.title}>
                Operator Node Status
            </h2>

            {errorOperator && (
                <div>
                    Error loading operator status.
                    {JSON.stringify(errorOperator)}
                </div>
            )}

            {!errorOperator && operator && (
                <>
                    <div className={styles.description}>
                        <code className={styles.code}>Operator name: {operator.name}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Operator ID: {operatorId}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Owner address: {operator.ownerAddress}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Public key: {utils.toUtf8String(operator.publicKey)}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Validators: {operator.validators.toString()}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Fee: {operator.fee.toString()}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Score: {operator.score.toString()}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Active: {operator.active ? "true" : "false"}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Balance: {
                            operator?.ownerAddress && (
                                <>
                                    {isLoadingAddressBalance && `Loading balance for ${operator?.ownerAddress}...`}
                                    {addressBalance && displayBalance(addressBalance)}
                                    {errorAddressBalance && JSON.stringify(errorAddressBalance)}
                                </>)
                        }</code>
                    </div>
                </>
            )}

            {errorOperatorApi ? (
                <div>
                    Error loading operator status from SSV API.
                </div>
            ) : operatorApiStatus && (
                <>
                    <div className={styles.description}>
                        <code className={styles.code}>Performance last 24h: {displayPercentage(operatorApiStatus?.performance['24h'])}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Performance last 30d: {displayPercentage(operatorApiStatus?.performance['30d'])}</code>
                    </div>
                </>
            )}
        </div>

    );
};


