import { BigNumber, utils } from 'ethers';
import { useOperatorPublicKey } from '../hooks/Operators';
import Spinner from "./Spinner";
import { ChangeEvent, useEffect, useState } from 'react';
import { useRegisterOperator } from '../hooks/write/useRegisterOperator';
import axios from 'axios';
import { server_config } from '../config'

export const RegisterOperator = ({ address }: { address?: string }) => {

    const { data: publicKey, error: public_key_error } = useOperatorPublicKey()

    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [isValidName, setIsValidName] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [fee, setFee] = useState<number>(3);

    const onRegistered = (id: number) => {
        setIsRegistering(false)
        console.log(`Registered as ${id}`)

        axios.post(`${server_config.monitor_url}/operatorId`, { id })
            .catch(e => { console.error(e) })
            .then(res => {
                //reload page
                window.location.reload();
            })
    }

    const convertFee = (fee: number) => {
        const oneSSV = BigNumber.from(417000000000)
        return BigNumber.from(fee).mul(oneSSV) // Choose 3 SSV for now

        // |Operator ID | getOperatorFee | amount on Website |
        // |------------|----------------|-------------------|
        // |        127 |  417000000000  |                 1 |
        // |          1	| 2085020000000  |                 5 |
        // |        680 | 8340100000000	 |                20 |
    }

    const { data: transactionResult, error: transactionError, write: register } = useRegisterOperator({ name, publicKey: utils.hexlify(utils.toUtf8Bytes(publicKey ?? "")), fee: convertFee(fee), onRegistered });

    useEffect(() => {
        if (transactionResult) {
            console.log(transactionResult)
            // immediately store the transaction hash, as a fallback for the use case where a user closes the browser before the operator ID is know and saved.
            axios.post(`${server_config.monitor_url}/registrationTransaction`, { hash: transactionResult.hash })
                .catch(e => { console.error(e) })
        }
    }, [transactionResult]);


    const handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
        const stringValue = event.target.value
        setName(stringValue)
        const nameInput = document.getElementById("name")
        const errorClassForInput = "input-error"
        if (stringValue) {
            nameInput?.classList.remove(errorClassForInput)
            setIsValidName(true)
        } else {
            nameInput?.classList.add(errorClassForInput)
            setIsValidName(false)
        }
    }


    const handleRegisterButton = (e: any) => {
        console.log("Registering")
        console.dir(name)
        console.dir(publicKey)
        console.dir(convertFee(fee))
        console.dir(register)

        if (register) {
            setIsRegistering(true);
            register();
        }
    }

    const etherscanUrl = (txHash: string) => {
        const prefix = server_config.network === "goerli" ? "goerli." : ""
        return `https://${prefix}etherscan.io/tx/${txHash}`
    }

    return (
        <div>
            {public_key_error ? (
                <>
                    <p>
                        Error loading your public SSV operator Key.
                    </p>
                    <code>
                        {public_key_error}
                    </code>
                    <p>
                        Consider resetting this package on the <a href="http://my.ava.do/#/Packages/ssv.avado.dappnode.eth/detail">SSV package management page</a>
                    </p>
                </>
            )
                : (
                    <>
                        {isRegistering && (
                            <>
                                <p>Waiting for registration</p>
                                <Spinner />
                                <p><b>DO NOT CLOSE THIS WINDOW</b></p>
                                <p>Please wait for the transaction to finish, this is necessary to capture your operator ID.</p>
                                {transactionResult && (<p>Waiting for transaction <a target="_blank" rel="noopener noreferrer" href={etherscanUrl(transactionResult.hash)}>{transactionResult.hash}</a></p>)}
                            </>
                        )}
                        {transactionError && (
                            <>
                                <p>The transaction failed: {JSON.stringify(transactionError)}</p>
                            </>
                        )}
                        {!isRegistering && (
                            <>
                                <div>
                                    <div className="text-center font-bold my-2">Operator name</div>

                                    <input
                                        onChange={handleNameInput}
                                        id="name"
                                        value={name}
                                        type="text"
                                        placeholder="your SSV operator name"
                                        className="input input-bordered w-1/3" />
                                </div>
                                <div>
                                    <div className="text-center font-bold my-2">Annual fee (SSV)</div>
                                    <input
                                        onChange={(event) => setFee(parseInt(event.target.value))}
                                        id="fee"
                                        value={fee}
                                        type="number"
                                        min="0"
                                        placeholder="your SSV operator fee"
                                        className="input input-bordered w-1/3" />
                                </div>
                                <div>
                                    <button
                                        className="btn text-white bg-gradient-to-r from-pink-500 to-violet-500"
                                        disabled={!isValidName || isRegistering}
                                        onClick={handleRegisterButton}>
                                        Register
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
        </div>

    );
};


