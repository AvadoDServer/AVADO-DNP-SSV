import React, { useEffect, useState } from 'react';
import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";

function App() {
    const [pubKey, setPubKey] = React.useState("1234");
    const [currentAccount, setCurrentAccount] = useState("");
    const [showKeyGen, setShowKeyGen] = useState(false);

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
                                {currentAccount && (
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
                                                        className="field input is-primary input-background-color-white"
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
                                                <div className="field is-large">
                                                        {pubKey}
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="button is-medium is-link"
                                        >
                                         register
                                        </button>
                                    </form>
                                )}

                                <div className="m-3">
                                    <button 
                                        className="button is-small is-link"
                                    >
                                        show keygen
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default App;
