const { createRegistry, createRequest } = require("@substreams/core");
const { readPackage } = require("@substreams/manifest");
const { BlockEmitter } = require("@substreams/node");
const { createNodeTransport } = require("@substreams/node/createNodeTransport");
const path = require("path");
const { NetworkParams } = require("@substreams/core/proto");

class ListenerE {
    constructor({network, apiKey, baseUrl, manifestPath, outputModule, startBlockNum}) {
        if (!apiKey) {
            throw new Error("SUBSTREAMS_API_KEY is required");
        }

        this.network = network
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        if (manifestPath.startsWith("https")) {
            this.manifestPath = manifestPath
        } else {
            this.manifestPath = path.resolve(manifestPath);
        }
        this.outputModule = outputModule;
        this.startBlockNum = startBlockNum;
        this.dataStore = {}
    }

    async init() {
        const substreamPackage = await readPackage(this.manifestPath);
        if (!substreamPackage.modules) {
            throw new Error("No modules found in substream package");
        }

        this.registry = createRegistry(substreamPackage);
        this.headers = new Headers({ "X-User-Agent": "@substreams/node", "X-Api-Key": this.apiKey });
        this.transport = createNodeTransport(this.baseUrl, this.apiKey, this.registry, this.headers);
        this.request = createRequest({
            substreamPackage,
            outputModule: this.outputModule,
            startBlockNum: this.startBlockNum,
        });
    }

    async start(dataStore) {
        await this.init();

        this.dataStore = dataStore;
        const emitter = new BlockEmitter(this.transport, this.request, this.registry);

        emitter.on("session", (session) => {
            console.dir(session);
        });

        emitter.on("anyMessage", (message, cursor, clock) => {
            const address_with_zeroes = message["events"][0]["topics"].slice(-1)[0]
            const address = "0x" + address_with_zeroes.slice(-40)

            console.log(`GOT ON ${this.network}`)
            this.dataStore[address] = clock.timestamp.seconds;
            console.dir(this.dataStore);
        });

        emitter.on("close", (error) => {
            if (error) {
                console.error(error);
            }
            console.timeEnd(`🆗 close ${this.network}`);
            console.log('restarting...')

            setTimeout(() => {
                emitter.start()
            }, 3000)
        });

        emitter.on("fatalError", (error) => {
            console.error(error);
        });

        emitter.start();
    }
}

exports.ListenerE = ListenerE