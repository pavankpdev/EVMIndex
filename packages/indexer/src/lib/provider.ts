import {createPublicClient, http, PublicClient} from 'viem'; // Assuming Viem is the client you're referring to
import {polygonMumbai} from 'viem/chains'

export class Provider {
    private _client: PublicClient;

    constructor(rpc: string) {
        this._client = this.setupClient(rpc);
    }

    private setupClient(rpc: string): PublicClient {
        return createPublicClient({
            chain: polygonMumbai,
            transport: http(rpc),
        });
    }

    public getClient(): PublicClient {
        return this._client;
    }
}