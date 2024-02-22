

const dev = false;

console.log(`network=${process.env["NETWORK"]}`);

exports.server_config = {
    monitor_url: dev ? "http://localhost:9999" : "http://ssv.my.ava.do:9999",
    ssv_api_url : "https://api.ssv.network/api/v4/mainnet",
    config_file_path: dev ? "./test/config.yml" : "/data/config.yml",
    network: "mainnet",
    dev: dev,
    execution_client_name: "avado-dnp-nethermind.public.dappnode.eth",
    execution_client_rest: `http://avado-dnp-nethermind.my.ava.do:8545`,
}

