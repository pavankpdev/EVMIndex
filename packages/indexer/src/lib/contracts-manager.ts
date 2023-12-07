import { DatabaseConnection } from "@/db/connect";
import {RegisterContractOptions} from "@/types";
import {ContractType} from "@/db/models/Contract";
import {v4 as uuid} from "uuid"

export class ContractsManager {
    private _dbConnection: any;

    constructor() {
        this._dbConnection = DatabaseConnection.getInstance().getDB();
    }

    async getContracts(): Promise<ContractType[]> {
        return this._dbConnection.contracts.find().exec();
    }

    async getContractById(id: string): Promise<ContractType | null> {
        return this._dbConnection.contracts.findOne({id}).exec();
    }

    async getContractByAddress(address: string): Promise<ContractType | null> {
        return this._dbConnection.contracts.findOne({address}).exec();
    }

    async registerContract(contract: RegisterContractOptions) {
        const contracts = await this.getContractByAddress(contract.address);
        if (contracts) {
            throw new Error(`Contract with address ${contract.address} already exists`);
        }
        const cid = uuid();
        await this._dbConnection.contracts.insert({
            id: cid,
            name: contract.name,
            address: contract.address,
            abi: contract.abi,
            startBlock: contract.startBlock,
            webhooks: contract.webhooks,
        });
        return cid;
    }

    async updateContractById(id: string, contract: RegisterContractOptions) {
        const contracts = await this.getContractById(id);
        if (!contracts) {
            throw new Error(`Contract with id ${id} does not exist`);
        }
        await this._dbConnection.contracts.findOneAndUpdate({id}, {
            name: contract.name,
            address: contract.address,
            abi: contract.abi,
            startBlock: contract.startBlock,
            webhooks: contract.webhooks,
        });

        return true;
    }

    async deleteContractById(id: string) {
        const contracts = await this.getContractById(id);
        if (!contracts) {
            throw new Error(`Contract with id ${id} does not exist`);
        }
        await this._dbConnection.contracts.findOneAndRemove({id});
        return true;
    }

}