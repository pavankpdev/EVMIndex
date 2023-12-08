import {DatabaseConnection} from "@/db/connect";
import {RegisterContractOptions} from "@/types";
import {ContractType, getContractCollection} from "@/db/models/Contract";
import {v4 as uuid} from "uuid"
import {RxDatabase, RxDocument} from "rxdb";

type Contract = ContractType & RxDocument

export class ContractsManager {
    private _dbConnection: RxDatabase;

    constructor() {
        this._dbConnection = DatabaseConnection.getInstance().getDB();
    }

    async getAllContracts(): Promise<Contract[]> {
        const contracts = await getContractCollection(this._dbConnection)
        return contracts.find().exec();
    }

    async getContractById(id: string): Promise<Contract | null> {
        const contracts = await getContractCollection(this._dbConnection)
        return contracts.findOne({
            selector: {
                id: {
                    $eq: id
                }
            }
        }).exec();
    }

    async getContractByAddress(address: string): Promise<Contract | null> {
        const contracts = await getContractCollection(this._dbConnection)
        return contracts.findOne({
            selector: {
                address: {
                    $eq: address
                }
            }
        }).exec();
    }

    async registerContract(contract: RegisterContractOptions) {
        const contracts = await getContractCollection(this._dbConnection)
        const cid = uuid();
        await contracts.insert({
            id: cid,
            name: contract.name,
            address: contract.address,
            abi: contract.abi,
            startBlock: contract.startBlock,
            webhooks: contract.webhooks,
        });
        return cid;
    }
    //
    async updateContractById(id: string, contractInput: RegisterContractOptions) {
        const contract = await this.getContractById(id);
        if (!contract) {
            throw new Error(`Contract with id ${id} does not exist`);
        }

        await contract.update({
            $set: {
                name: contractInput.name,
                address: contractInput.address,
                abi: contractInput.abi,
                startBlock: contractInput.startBlock,
                webhooks: contractInput.webhooks,
            }
        })

        return true;
    }

    async deleteContractById(id: string) {
        const contract = await this.getContractById(id);
        if (!contract) {
            throw new Error(`Contract with id ${id} does not exist`);
        }
        return contract.remove()
    }

    async deleteAllContracts() {
        const contracts = await this.getAllContracts()
        return contracts.forEach(contract => contract.remove())
    }

}