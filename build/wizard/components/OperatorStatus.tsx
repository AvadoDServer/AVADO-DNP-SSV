import styles from '../styles/Home.module.css';
import Web3 from 'web3';
import { BigNumber, utils } from 'ethers';
import { useAddressBalance } from '../hooks/read/useAddressBalance';
import { useOperatorStatus } from '../hooks/Operators';
import { useOperatorById } from '../hooks/read/useOperatorById';
import { useValidatorsByOwnerAddress } from '../hooks/read/useValidatorsByOwnerAddress';
import { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish, faTrash } from "@fortawesome/free-solid-svg-icons";

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
            <h2 className="title is-2">
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
                    <div>
                        <div>
                            <table className="table">
                                <tbody>
                                    {/* <tr>
                                        <td><b>Execution (ETH1) node</b></td>
                                        <td><SyncStatusTag progress={nodeSyncStatus.ecStatus.primaryEcStatus.syncProgress} /></td>
                                    </tr>
                                    <tr>
                                        <td><b>Beacon chain (ETH2) node</b></td>
                                        <td><SyncStatusTag progress={nodeSyncStatus.bcStatus.primaryEcStatus.syncProgress} /></td>
                                    </tr> */}
                                    <tr>
                                        <td><b>Operator name</b></td>
                                        <td>{operator.name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Operator ID</b></td>
                                        <td>
                                            <a href={`https://explorer.ssv.network/operators/${operatorId}`}>
                                                <img src="ssv.png" alt="ssv.network" className="icon"></img> {operatorId}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Owner address</b></td>
                                        <td><a href={`https://etherscan.io/address/${operator.ownerAddress}`}>
                                            <img src="etherscan-1.png" alt="etherscan.network" className="icon"></img> {operator.ownerAddress}
                                        </a></td>
                                    </tr>
                                    <tr>
                                        <td><b>Public key</b></td>
                                        <td>{displayTrimmed(operator.publicKey)}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Validators</b></td>
                                        <td>{operator.validators.toString()}</td>
                                    </tr>
                                    {validators && (
                                        <>
                                            {validators.map((validator) => {
                                                return <tr key={validator}>
                                                    <td></td>
                                                    <td>
                                                        <a href={`https://explorer.ssv.network/validators/${validator}`}>
                                                            <img src="ssv.png" alt="ssv.network" className="icon"></img>
                                                        </a>
                                                        <a href={`https://prater.beaconcha.in/validator/${validator}`}>
                                                            <FontAwesomeIcon className="icon" icon={faSatelliteDish} />
                                                        </a>
                                                        {validator}
                                                    </td>

                                                </tr>

                                            })}
                                        </>
                                    )}
                                    <tr>
                                        <td><b>Fee</b></td>
                                        <td>{operator.fee.toString()}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Score</b></td>
                                        <td>{operator.score.toString()}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Active</b></td>
                                        <td>{`${operator.active}`}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Balance</b></td>
                                        <td>{
                                            operator?.ownerAddress && (
                                                <>
                                                    {isLoadingAddressBalance && `Loading balance for ${operator?.ownerAddress}...`}
                                                    {addressBalance && displayBalance(addressBalance)}
                                                    {errorAddressBalance && JSON.stringify(errorAddressBalance)}
                                                </>)
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td><b>Performance last 24h</b></td>
                                        <td>
                                            {errorOperatorApi ? (<>Error loading operator status from SSV API.</>)
                                                : <> {operatorApiStatus && displayPercentage(operatorApiStatus?.performance['24h'])}</>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Performance last 30d</b></td>
                                        <td>
                                            {errorOperatorApi ? (<>Error loading operator status from SSV API.</>)
                                                : <> {operatorApiStatus && displayPercentage(operatorApiStatus?.performance['30d'])}</>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
};


