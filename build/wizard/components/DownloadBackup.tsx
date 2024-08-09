import { server_config } from "../config"

export const DownloadBackup = () => {
    return (
        <div>
            <a href={`${server_config.monitor_url}/getBackup`} className="button">
                Download Backup Key File
            </a>
        </div>

    );
};


