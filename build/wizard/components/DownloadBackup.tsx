import styles from '../styles/Home.module.css';
import axios from 'axios';
import { server_config } from "../config"

export const DownloadBackup = () => {

    const downloadBackup = () => {
        const element = document.createElement("a");

        axios.get(`${server_config.monitor_url}/config`).then((res) => {
            const config = res.data;
            const blob = new Blob([JSON.stringify(config, null, 2)], {
                type: "application/json",
            });
            element.href = URL.createObjectURL(blob);
            element.download = "config.yml";
            document.body.appendChild(element);
            element.click();
        });
    }

    return (
        <div>
            <button
                className="button"
                onClick={downloadBackup}>
                Download Backup
            </button>
        </div>

    );
};


