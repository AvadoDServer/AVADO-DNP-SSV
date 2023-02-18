import styles from '../styles/Home.module.css';
import Web3 from 'web3';

const web3 = new Web3();

export const SsvButtons = ({ operatorId }: { operatorId: number }) => {
    return (
        <div>
            <a href={`https://app.ssv.network/`} className="button">Manage operator on SSV app</a>
            <a href={`https://explorer.ssv.network/operators/${operatorId}`} className="button" >SSV Explorer</a>
        </div>
    );
};


