import {officialSubstreamEndpointsUrls} from "../services/substreams/config.js";
import {ListenerE} from "../services/substreams/listener.js";

export const initializeSubstreamsListeners = async () => {
    const listeners = [];
    Object.entries(officialSubstreamEndpointsUrls).forEach(([network, baseUrl]) => {
        listeners.push(new ListenerE({
            network: network,
            apiKey: process.env.SUBSTREAMS_API_KEY,
            baseUrl: baseUrl, // Replace with the actual base URL
            manifestPath: `https://spkg.io/goftok/smart-contract-events-retriever-${network}-v0.1.0.spkg`,
            outputModule: 'map_contract_events',
            startBlockNum: -1
        }));
    });

    const dataStore = {};
    console.log('started initializing streams')
    for (const listener of listeners.values()) {
        console.log(`before ${listener.network}`)
        await listener.start(dataStore);
        console.log(dataStore)
    }
    console.log('ended initializing streams')
}
