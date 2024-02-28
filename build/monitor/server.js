const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const axios = require('axios').default;
const yaml = require('js-yaml');
const fs = require('fs');
const { server_config } = require('./config.js')

const getConfig = () => {
    try {
        const config = yaml.load(fs.readFileSync(server_config.config_file_path, 'utf8'))
        return config ? config : {}
    } catch (e) {
        return {};
    }
}

const getKeyFile = () => {
    try {
        const config = JSON.parse(fs.readFileSync(server_config.private_key_file, 'utf8'))
        return config ? config : {}
    } catch (e) {
        return {};
    }
}

console.log("Monitor starting...");

const server = restify.createServer({
    name: "MONITOR",
    version: "1.0.0"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "http://*.dappnode.eth",
        "http://*.my.ava.do"
    ]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.get("/ping", (req, res, next) => {
    res.send(200, "pong");
    next()
});

server.get("/isRegistered", (req, res, next) => {
    const config = getConfig();
    res.send(200, { "data": !!config.isRegistered });
    next()
});

// server.get("/operatorId", (req, res, next) => {
//     const config = getConfig();
//     const id = config?.publicKey;
//     res.send(200, { "data": id });
//     next()
// });

server.get("/keyfile", (req, res, next) => {
    const config = getKeyFile();
    // if (server_config.dev)
    //     console.log("config:", config)
    res.send(200, config);
    next()
});

server.get("/operatorPublicKey", (req, res, next) => {
    const config = getKeyFile();
    const key = config.publicKey;
    res.send(200, { "data": key });
    next()
});

server.post("/restoreConfig", (req, res, next) => {
    if (!req.body || !req.body.config) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        console.log("Restoring configuration from a backup")
        const config = req.body.config;
        fs.writeFileSync(server_config.config_file_path, config, 'utf8');
        res.send(200, `Backup is restored`);
        return next();
    }
});

// server.post("/operatorId", (req, res, next) => {
//     if (!req.body) {
//         res.send(400, "not enough parameters");
//         return next();
//     } else {
//         const id = req.body.id;
//         console.log("Setting operator id " + id)
//         const config = getConfig();
//         config.OperatorId = id;
//         let yamlStr = yaml.dump(config);
//         fs.writeFileSync(server_config.config_file_path, yamlStr, 'utf8');
//         res.send(200, `Operator id set to ${id}`);
//         return next();
//     }
// });

server.post("/registrationTransaction", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        const hash = req.body.hash;
        console.log("Setting registration hash " + hash)
        const config = getConfig();
        config.RegistrationHash = hash;
        let yamlStr = yaml.dump(config);
        fs.writeFileSync(server_config.config_file_path, yamlStr, 'utf8');
        res.send(200, `Registration transaction hash is stored`);
        return next();
    }
});

server.get("/operators/:id", (req, res, next) => {
    const id = req.params.id;
    if (id) {
        const url = `https://api.ssv.network/api/v4/${server_config.network}/operators/${id}`
        if (server_config.dev)
            console.log(url)
        get(url, res, next)
    }
});

server.get("/operators/owned_by/:address", (req, res, next) => {
    const address = req.params.address;
    if (address) {
        const url = `https://api.ssv.network/api/v4/${server_config.network}/operators/owned_by/${address}`
        if (server_config.dev)
            console.log(url)
        get(url, res, next)
    }
});

server.get("/validators/in_operator/:id", (req, res, next) => {
    const id = req.params.id;
    if (id) {
        const url = `https://api.ssv.network/api/v4/${server_config.network}/validators/in_operator/${id}`
        if (server_config.dev)
            console.log(url)
        get(url, res, next)
    }
});

server.get("/beaconNodeStatus", (req, res, next) => {
    const config = getConfig();
    console.dir(config)
    const beaconNodeAddr = config.eth2.BeaconNodeAddr;
    if (beaconNodeAddr) {
        const url = `${beaconNodeAddr}/eth/v1/node/syncing`
        get(url, res, next)
    } else {
        console.log("Invalid config");
        res.send(200, "Invalid config)")
        next()
    }
});


const get = (url, res, next) => {
    axios.get(url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (response) => {
                console.dir(response.data)
                const data = response.data
                res.send(200, { "data": data })
                next();
            }
        ).catch(
            (error) => {
                console.log("Error contacting ", url, error);
                res.send(200, "failed")
                next();
            }
        )
}

const listAllRoutes = (server) => {
    return Object.values(server.router.getRoutes()).map(value =>
        [value.method, value.path]
    );
}

server.get("/", (req, res, next) => {
    const routes = listAllRoutes(server)
        .filter(([method, path]) => path !== "/")
        .map(([method, path]) => `<li><a href="${path}">${path}</a> (${method})</li>`);

    var body = `<html><body><ul>routes: ${routes.join("\n")}</ul></body></html>`;
    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
});


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
    console.log("Using config %s", server_config.config_file_path);
    // console.dir(getConfig())
});
