import { BigNumber, Bytes, utils } from 'ethers';
import { useOperatorPublicKey } from '../hooks/Operators';
import Spinner from "./Spinner";
import { ChangeEvent, useEffect, useState } from 'react';
import { useRegisterOperator } from '../hooks/write/useRegisterOperator';
import axios from 'axios';
import {server_config} from '../config'

export const RegisterOperator = ({ address }: { address?: string }) => {

    const { data: publicKey, error: public_key_error } = useOperatorPublicKey()

    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [isValidName, setIsValidName] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [publicKeyBytes, setPublicKeyBytes] = useState<Bytes>([]);


    const oneSSV = BigNumber.from(417000000000)
    const fee = BigNumber.from(3).mul(oneSSV) // Choose 3 SSV for now
    // |Operator ID | getOperatorFee | amount on Website |
    // |------------|----------------|-------------------|
    // |        127 |  417000000000  |                 1 |
    // |          1	| 2085020000000  |                 5 |
    // |        680 | 8340100000000	 |                20 |


    //FIXME: how to convert string ot base64 bytes?
    useEffect(() => {
        if (publicKey) {
            // Operator public key - Generated in the node installation process (base64 format)
            const test = publicKey
            console.log(test)
            console.log(utils.toUtf8Bytes(test))
            setPublicKeyBytes(utils.toUtf8Bytes(test))
        }
    }, [publicKey]);

    const onRegistered = (id: number) => {
        setIsRegistering(false)
        console.log(`Registered as ${id}`)

        axios.post(`${server_config.monitor_url}/operatorId`, { id })
            .catch(e => { console.error(e) })

        //reload page
        window.location.reload();
    }

    const { data: transactionResult, error: transactionError, write: register } = useRegisterOperator({ name, publicKey: publicKeyBytes, fee, onRegistered });

    useEffect(() => {
        if (transactionResult) {
            console.log(transactionResult)
            // immediately store the transaction hash, as a fallback for the use case where a user closes the browser before the operator ID is know and saved.
            axios.post(`${server_config.monitor_url}/registrationTransaction`, { hash: transactionResult.hash})
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
        console.dir(fee)
        console.dir(register)

        if (register) {
            setIsRegistering(true);
            register();
        }
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
                                <div>
                                    <Spinner />
                                </div>
                                {transactionResult && (<p>Waiting for transaction <a target="_blank" rel="noopener noreferrer" href={"https://goerli.etherscan.io/tx/" + transactionResult.hash}>{transactionResult.hash}</a></p>)}
                            </>
                        )}
                        {transactionError && (
                            <>
                                <p>The transaction failed: {JSON.stringify(transactionError)}</p>
                            </>
                        )}
                        {!isRegistering && (
                            <>
                                {/* <div>
                                    <textarea>
                                        {publicKey}
                                    </textarea>
                                </div>
                                <div>
                                    <textarea>
                                        {"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002644c5330744c5331435255644a54694253553045675546564354456c4449457446575330744c533074436b314a53554a4a616b464f516d64726357687261556335647a424351564646526b464254304e425554684254556c4a516b4e6e53304e425555564263587047596c6873566b524e61586c7751573174517a68776448594b4f487075627a6777636c4d3357586c4955537445615564354d444e6e546b4a6e516c643159556779536a6b334e5774534e444a73525774466331644852444a45527a427263574e7965565931616a63765657566b647770324f476c4b56566c6a4e6c413455576c6c513164505448524a576d746d516d684f4e44646a53556b7762476c75526b4a54626b313152314935596e4977656a4e50644374534d5731574d4746355247707764484e4d436e637a646d6852516a4668556d30336558644a626a5246536e46305a7a5a34553356595a476c68547a4e544c3268725a324e4a4e7a646b5956526f617a4a4c555867354b32353561476f7665574a7a53325a7057576b4b65565a4c5158424e535863785544646965574d7a59574533637a5a565245316e574468794f546735543230766554466d5a486443636b51326355786e59326c3062545259515730334e31464e516a52424d3068495977704e596d393263566c47626a45354e4739535153747155464d724d5842794d46704363575a6b6243395963544243556c64745a6c42506231646165577469616b314c5455464f5645356162475a6859564d325a574a5a436e64525355524255554643436930744c5330745255354549464a545153425156554a4d53554d675330565a4c5330744c53304b00000000000000000000000000000000000000000000000000000000"}
                                    </textarea>
                                </div>
                                <div>
                                    <textarea>
                                        {utils.toUtf8String("0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002644c5330744c5331435255644a54694253553045675546564354456c4449457446575330744c533074436b314a53554a4a616b464f516d64726357687261556335647a424351564646526b464254304e425554684254556c4a516b4e6e53304e425555564263587047596c6873566b524e61586c7751573174517a68776448594b4f487075627a6777636c4d3357586c4955537445615564354d444e6e546b4a6e516c643159556779536a6b334e5774534e444a73525774466331644852444a45527a427263574e7965565931616a63765657566b647770324f476c4b56566c6a4e6c413455576c6c513164505448524a576d746d516d684f4e44646a53556b7762476c75526b4a54626b313152314935596e4977656a4e50644374534d5731574d4746355247707764484e4d436e637a646d6852516a4668556d30336558644a626a5246536e46305a7a5a34553356595a476c68547a4e544c3268725a324e4a4e7a646b5956526f617a4a4c555867354b32353561476f7665574a7a53325a7057576b4b65565a4c5158424e535863785544646965574d7a59574533637a5a565245316e574468794f546735543230766554466d5a486443636b51326355786e59326c3062545259515730334e31464e516a52424d3068495977704e596d393263566c47626a45354e4739535153747155464d724d5842794d46704363575a6b6243395963544243556c64745a6c42506231646165577469616b314c5455464f5645356162475a6859564d325a574a5a436e64525355524255554643436930744c5330745255354549464a545153425156554a4d53554d675330565a4c5330744c53304b00000000000000000000000000000000000000000000000000000000")}
                                    </textarea>
                                </div> */}
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


