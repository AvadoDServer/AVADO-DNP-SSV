import React, { useEffect, useState } from 'react';
import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

function App() {
    const [pubKey, setPubKey] = React.useState("LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBbndINlBQUDNEZVJ4T3BocUwvRFkKNnNWTnl4MTFiQ0pQcDVoTHVsZkNIVXp1TlVCUGhUZ05wQ2UyajhFNG0rd2JJRGZ1TjFPSmJhbGRleVdBcTJ1Kwp2TFo0SFhoby9HVzVOcVlTZ0VYUWpXbG5sNzFLejlHZHpQSG1MbGs1RldaYXNWZkZnZ09HM0I4eG9ncnA0VHp0CnJLS3BVdW5VZ2k4RXBLamx0MXBVUWFyWmRUenNyWC90V012Mm5YYWRXRm9XTG85N0lER0ltWE5YN2t4ZXZDRzQKMkxNcFZKMzh3WFRINVN1TExWa2hCa09ZTlBMYkl5YnJ1bE9SMHlwNjQ1OXY4TkFlK213K2xGNHQ1Y0t4S0VFdgp3QWNGc2RTOUkvNlVweW9GeEdENUxWcGJMQVZQUXNzT2pzUjhxeWNxVVBUNHZkR2llRzBWS2l3Vll0aEs0ZnZoCnJ3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K");
    const [currentAccount, setCurrentAccount] = useState("");
    const [splitValidatorKey, setSplitValidatorKey] = useState(false);
    const [file, setFile] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    React.useEffect(() => {
        axios.get("./auth-token.txt").then((res) => {
            //setAuthToken(res.data);
        })
    }, []);


    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
            } else {
            console.log("We have the ethereum object", ethereum);
            }

            /*
            * Check if we're authorized to access the user's wallet
            */
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
            } else {
            console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
            alert("Get MetaMask!");
            return;
            }

            const accounts = await ethereum.request({
            method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="App">
            <section className="hero is-default is-bold">
                <div className="hero-body">
                    <div className="container has-text-centered ">
                        <div className="columns is-vcentered">
                            <div className="column  is-6 is-offset-1">
                                <h1 className="title has-text-white is-2">
                                    Avado SSV
                                </h1>
                                <br />
                                <h2 className="subtitle  has-text-white is-4">
                                    Let's start by registering your ssv node
                                </h2>

                                <br />

                                {!currentAccount && (
                                    <p className="has-text-centered">
                                        <button className="button is-medium is-link" onClick={connectWallet}>
                                            connect metamask wallet
                                        </button>
                                    </p>
                                )}
                                
                                {currentAccount && !splitValidatorKey && (
                                    <form onSubmit={handleSubmit(onSubmit)} className="has-text-centered">
                                        
                                        <div className="field is-horizontal">
                                            <div className="field-label is-normal">
                                                <label className="label has-text-white">DisplayName</label>
                                            </div>
                                            <div className="field-body">
                                                <div className="field">
                                                    <p className="control">
                                                    <input 
                                                        placeholder="displayName" 
                                                        {...register("nodeName", { required: true })} 
                                                        className="field input is-primary"
                                                    />
                                                    {errors.rewardAddress && <span>This field is required</span>}                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="field is-horizontal">
                                            <div className="field-label is-normal">
                                                <label className="label has-text-white">Payout @</label>
                                            </div>
                                            <div className="field-body">
                                                <div className="field">
                                                    <p className="control">
                                                    <input 
                                                        value={currentAccount}
                                                        {...register("rewardAddress", { required: true })} 
                                                        className="field input is-primary"
                                                    />
                                                    {errors.rewardAddress && <span>This field is required</span>}                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="field is-horizontal">
                                            <div className="field-label is-normal">
                                                <label className="label has-text-white">PubKey</label>
                                            </div>
                                            <div className="field-body">
                                                <input 
                                                    value={pubKey}
                                                    {...register("pubKey", { required: true })} 
                                                    className="field input is-primary disabled"
                                                    disabled
                                                />
                                                {errors.pubKey && <span>This field is required</span>}   
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="button is-medium is-link"
                                        >
                                         register
                                        </button>

                                        <div className="showkeygen">
                                            <button 
                                                className="button is-small is-link"
                                                onClick={() => setSplitValidatorKey(true)}
                                            >
                                                split validator key
                                            </button>
                                        </div>
                                    </form>

                                    
                                )}

                                {currentAccount && splitValidatorKey && (
                                    <div className="showkeygen">
                                        <StyledDropZone
                                            onDrop={(file, text) => setFile(text)}
                                        />
                                        
                                        {file !== "" && (
                                            <div className="showkeygen">
                                                <div>Key split 1: {file.substring(0,20)}</div>
                                                <div>Key split 2: {file.substring(21,40)}</div>
                                                <div>Key split 3: {file.substring(41,60)}</div>
                                                <div>Key split 4: {file.substring(61,80)}</div>
                                                <div>Key split 5: {file.substring(81,100)}</div>
                                            </div>
                                        )}

                                    </div>
                                )}

                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
