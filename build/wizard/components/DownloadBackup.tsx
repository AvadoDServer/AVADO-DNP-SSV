import axios from 'axios';
import { server_config } from "../config"
const yaml = require('js-yaml');

export const DownloadBackup = () => {
    return (
        <div>
            <a href={`${server_config.monitor_url}/getBackup`} className="button">
                Download Backup Key File
            </a>
        </div>

    );
};


