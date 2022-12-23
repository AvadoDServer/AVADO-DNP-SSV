import styles from '../styles/Home.module.css';
import Web3 from 'web3';
import { BigNumber, utils } from 'ethers';
import { useAddressBalance } from '../hooks/read/useAddressBalance';
import { useOperatorStatus } from '../hooks/Operators';
import { useOperatorById } from '../hooks/read/useOperatorById';
import { useValidatorsByOwnerAddress } from '../hooks/read/useValidatorsByOwnerAddress';
import { useEffect } from 'react';

const web3 = new Web3();

export const OperatorStatus = ({ operatorId }: { operatorId: number }) => {

    const { data: operator, error: errorOperator } = useOperatorById(operatorId)
    const { data: addressBalance, error: errorAddressBalance, isLoading: isLoadingAddressBalance } = useAddressBalance(operator?.ownerAddress)
    const { data: operatorApiStatus, error: errorOperatorApi } = useOperatorStatus({ operatorId })
    const { data: validators, error: errorsValidators, isLoading: isLoadingValidators } = useValidatorsByOwnerAddress(operator?.ownerAddress)


    useEffect(() => {
        if (validators) {
            console.log(JSON.stringify(validators))
        }
    }, [validators]);

    const displayBalance = (addressBalance: any) => {
        const balance = addressBalance as BigNumber;
        return web3.utils.fromWei(balance?.toString()) + " SSV"
    }

    const displayPercentage = (performance: any) => {
        const perf = performance as number;
        return perf.toFixed(2) + "%"
    }

    const displayTrimmed = (input: string) => {
        //TODO: what is the correct way of doing this? No idead where the unwanted prefix comes from
        var trimmedInput = input
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            .trim();
        trimmedInput = trimmedInput.substring(trimmedInput.indexOf("d") + 1);

        if (trimmedInput.length < 50)
            return input;
        return <abbr title={trimmedInput}>{trimmedInput.substring(0, 20) + "…" + trimmedInput.substring(trimmedInput.length - 20)}</abbr>
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
                        <code className={styles.code}>Public key: {displayTrimmed(operator.publicKey)}</code>
                    </div>
                    <div className={styles.description}>
                        <code className={styles.code}>Validators: {operator.validators.toString()}</code>
                    </div>
                    {validators && (
                        <>
                            {validators.map((validator) => {
                                return <div key={validator}>{validator}</div>
                            })}
                        </>
                    )}
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


