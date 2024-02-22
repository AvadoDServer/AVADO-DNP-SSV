

const dev = false;

console.log(`network=${process.env["NETWORK"]}`);

exports.server_config = {
    monitor_url: dev ? "http://localhost:9999" : "http://ssv.my.ava.do:9999",
    config_file: "/data/ssv-config.json",
    private_key_file: "/data/encrypted_private_key.json",
    network: "mainnet",
    dev: dev
}

