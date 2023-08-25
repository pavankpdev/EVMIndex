import {RegisterContractOptions} from "./types"

export class EVMIndex {
    // TODO: Connect DB in constructor

    public registerContract(options: RegisterContractOptions): void {
        console.log("Registering contract", options)
        // TODO: validate options
        // TODO: add to DB
        // TODO: run a listener
    }
}