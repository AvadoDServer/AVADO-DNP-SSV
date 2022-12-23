import styles from '../styles/Home.module.css';
import axios from 'axios';
import { server_config } from "../config"

export const RestoreBackup = () => {

    const restoreBackup = () => {
        const element = document.createElement("a");

        axios.get(`${server_config.monitor_url}/config`).then((res) => {
            alert("TODO");
        });
    }

    return (
        <div>
            <button
                className="btn text-white bg-gradient-to-r from-pink-500 to-violet-500"
                onClick={restoreBackup}>
                Restore Backup
            </button>
        </div>

    );
};


