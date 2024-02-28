import axios from 'axios';
import { server_config } from "../config"
const yaml = require('js-yaml');

export const DownloadBackup = () => {

    const downloadBackup = (name: String) => {
        const element = document.createElement("a");

        axios.get(`${server_config.monitor_url}/${name}`).then((res) => {
            const config = yaml.dump(res.data)
            const blob = new Blob([config], {
                type: "application/json",
            });
            element.href = URL.createObjectURL(blob);
            element.download = `${name}.yml`;
            document.body.appendChild(element);
            element.click();
        });
    }

    return (
        <div>
            <button className="button" onClick={() => downloadBackup("keyfile")}>
                Download Backup Key File
            </button>
            <button className="button" onClick={() => downloadBackup("operatorPublicKey")}>
                Download Backup Operator Public Key
            </button>
        </div>

    );
};


