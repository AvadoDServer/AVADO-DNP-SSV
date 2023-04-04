import styles from '../styles/Home.module.css';
import Web3 from 'web3';
import { BigNumber, utils } from 'ethers';
import { useAddressBalance } from '../hooks/read/useAddressBalance';
import { useOperatorStatus, useBeaconNodeStatus, useValidatorsInOperator } from '../hooks/Operators';
import { useOperatorById } from '../hooks/read/useOperatorById';
import { useValidatorsByOwnerAddress } from '../hooks/read/useValidatorsByOwnerAddress';
import { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish, faTrash } from "@fortawesome/free-solid-svg-icons";
import { server_config } from '../config'
import { OperatorType } from '../types'
import ClickToCopy from "./ClickToCopy";

const web3 = new Web3();

export const OperatorStatus = ({ operatorId }: { operatorId: bigint }) => {

    const { data: operator, error: errorOperator } = useOperatorById(operatorId)
    const { data: addressBalance, error: errorAddressBalance, isLoading: isLoadingAddressBalance } = useAddressBalance(operator?.ownerAddress)
    const { data: operatorApiStatus, error: errorOperatorApi } = useOperatorStatus({ operatorId })
    const { data: own_validators, error: errorsOwnValidators, isLoading: isLoadingOwnValidators } = useValidatorsByOwnerAddress(operator?.ownerAddress)
    const { data: all_validators, error: errorsAllValidators } = useValidatorsInOperator({ operatorId })
    const beaconNodeStatus = useBeaconNodeStatus();

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
        return <ClickToCopy text={trimmedInput}>{<abbr title={trimmedInput}>{trimmedInput.substring(0, 20) + "…" + trimmedInput.substring(trimmedInput.length - 20)}</abbr>}</ClickToCopy>
    }

    const readibleFee = (fee: BigNumber) => {
        const oneSSV = BigNumber.from(417000000000)
        return fee.div(oneSSV)
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
                                    <tr>
                                        <td><b>Beacon node status</b></td>
                                        <td>{beaconNodeStatus && (
                                            <>
                                                {beaconNodeStatus.error || !beaconNodeStatus.data ?
                                                    <>Could not get Status</>
                                                    : <>{beaconNodeStatus.data.data.is_syncing ? "syncing" : "in sync"}</>
                                                }
                                            </>
                                        )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Operator ID</b></td>
                                        <td>
                                            <a href={`https://explorer.ssv.network/operators/${operatorId}`}>
                                                <img src="ssv.png" alt="ssv.network" className="icon"></img> {operatorId.toString()}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Owner address</b></td>
                                        <td><a href={`https://${server_config.network === "goerli" ? "goerli." : ""}etherscan.io/address/${operator.ownerAddress}`}>
                                            <img src="etherscan-1.png" alt="etherscan.network" className="icon"></img> {operator.ownerAddress}
                                        </a></td>
                                    </tr>
                                    {/* <tr>
                                        <td><b>Public key</b></td>
                                        <td>{displayTrimmed(operator.publicKey)}</td>
                                    </tr> */}
                                    {own_validators && (
                                        <>
                                            <tr>
                                                <td><b>Own Validators</b></td>
                                                <td>{own_validators.length}</td>
                                            </tr>
                                            {own_validators.map(validator => <tr key={validator}>
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
                                            )}
                                        </>
                                    )}
                                    <tr>
                                        <td><b>All Validators</b></td>
                                        <td>{operator.validators.toString()}</td>
                                    </tr>
                                    {all_validators && (
                                        <>
                                            {all_validators.map(validator => <tr key={validator.public_key}>
                                                <td></td>
                                                <td>
                                                    <a href={`https://explorer.ssv.network/validators/${validator.public_key}`}>
                                                        <img src="ssv.png" alt="ssv.network" className="icon"></img>
                                                    </a>
                                                    <a href={`https://prater.beaconcha.in/validator/${validator.public_key}`}>
                                                        <FontAwesomeIcon className="icon" icon={faSatelliteDish} />
                                                    </a>
                                                    {`0x${validator.public_key}`}
                                                </td>
                                            </tr>
                                            )}
                                        </>
                                    )}
                                    <tr>
                                        <td><b>Fee</b></td>
                                        <td>{readibleFee(operator.fee).toString()} SSV</td>
                                    </tr>
                                    {/* <tr>
                                        <td><b>Score</b></td>
                                        <td>{operator.score.toString()}</td>
                                    </tr> */}
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

                                    {operatorApiStatus &&
                                        Object.entries(operatorApiStatus?.performance).map(([key, value]) =>
                                            <tr key={key}>
                                                <td><b>Performance last {key}</b></td>
                                                <td>{errorOperatorApi ?
                                                    <>Error loading operator status from SSV API.</>
                                                    : <> {displayPercentage(value)}</>
                                                }
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
};


