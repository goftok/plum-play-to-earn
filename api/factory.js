const { officialSubstreamEndpointsUrls } = require("../services/substreams/config");

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
    for (const listener of listeners.values()) {
        await listener.start(dataStore);
        console.log(dataStore)
    }
}
