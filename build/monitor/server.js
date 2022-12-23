const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const axios = require('axios').default;
const yaml = require('js-yaml');
const fs = require('fs');
const { server_config } = require('./config.js')

const getConfig = () => yaml.load(fs.readFileSync(server_config.config_file_path, 'utf8'));

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

server.get("/operatorId", (req, res, next) => {
    const config = getConfig();
    const id = "OperatorId" in config ? config.OperatorId : 0;
    if (server_config.dev)
        console.log("id:", id)
    res.send(200, { "data": id });
    next()
});

server.get("/config", (req, res, next) => {
    const config = getConfig();
    if (server_config.dev)
        console.log("config:", config)
    res.send(200, config);
    next()
});

server.get("/operatorPublicKey", (req, res, next) => {
    const config = getConfig();
    const key = "OperatorPublicKey" in config ? config.OperatorPublicKey : "";
    res.send(200, { "data": key });
    next()
});

server.post("/operatorId", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        const id = req.body.id;
        console.log("Setting operator id " + id)
        const config = getConfig();
        config.OperatorId = id;
        let yamlStr = yaml.dump(config);
        fs.writeFileSync(server_config.config_file_path, yamlStr, 'utf8');
        res.send(200, `Operator id set to ${id}`);
        return next();
    }
});

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
        const url = `https://api.ssv.network/api/v1/operators/${id}`
        if (server_config.dev)
            console.log(url)
        get(url, res, next)
    }
});

server.get("/operators/owned_by/:address", (req, res, next) => {
    const address = req.params.address;
    if (address) {
        const url = `https://api.ssv.network/api/v1/operators/owned_by/${address}`
        if (server_config.dev)
            console.log(url)
        get(url, res, next)
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


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
    console.log("Using config %s", server_config.config_file_path);
    // console.dir(getConfig())
});
