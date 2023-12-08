import {ContractsManager} from "../lib/contracts-manager";

describe('ContractsManager class', () => {
    let contractManager: ContractsManager;
    const testContract = {
        name: "Test Contract",
        address: "0x1234567890123456789012345678901234567890",
        abi: JSON.stringify([]),
        startBlock: 0,
        webhooks: []
    }

    beforeEach(() => {
        contractManager = new ContractsManager();
    });

    it("should be able to create an instance", () => {
        expect(contractManager).toBeInstanceOf(ContractsManager);
    })

    it("should be able to register a new contract", async () => {
        const cid = await contractManager.registerContract(testContract);
        const contract  = await contractManager.getContractById(cid);

        expect(cid).toBeDefined();
        expect(contract).toBeDefined();
        expect(contract?.id).toEqual(cid);
        expect(contract?.name).toEqual(testContract.name);
        expect(contract?.address).toEqual(testContract.address);
        expect(contract?.abi).toEqual(testContract.abi);
        expect(contract?.startBlock).toEqual(testContract.startBlock);
        expect(contract?.webhooks).toEqual(testContract.webhooks);
    })

    it("should be able to update a contract", async () => {
        const cid = await contractManager.registerContract(testContract);
        const propertiesToUpdate = {
            name: "New Name",
            address: "0x0987654321098765432109876543210987654321",
            abi: JSON.stringify([{}]),
            startBlock: 1,
            webhooks: ["http://localhost:3000"]
        }

        await contractManager.updateContractById(cid, propertiesToUpdate);
        const contract  = await contractManager.getContractById(cid);


        expect(cid).toBeDefined();
        expect(contract).toBeDefined();
        expect(contract?.id).toEqual(cid);
        expect(contract?.name).toEqual(propertiesToUpdate.name);
        expect(contract?.address).toEqual(propertiesToUpdate.address);
        expect(contract?.abi).toEqual(propertiesToUpdate.abi);
        expect(contract?.startBlock).toEqual(propertiesToUpdate.startBlock);
        expect(contract?.webhooks).toEqual(propertiesToUpdate.webhooks);
    })

    it("should be able to delete a contract", async () => {
        const cid = await contractManager.registerContract(testContract);
        await contractManager.deleteContractById(cid);
        const contract = await contractManager.getContractById(cid);

        expect(cid).toBeDefined();
        expect(contract).toBeNull()
    })

    it('should be able to get contracts by id and address', async () => {
        const cid = await contractManager.registerContract(testContract);
        const contractById = await contractManager.getContractById(cid);
        const contractByAddress = await contractManager.getContractByAddress(testContract.address);

        expect(cid).toBeDefined();
        expect(contractById).toBeDefined();
        expect(contractByAddress).toBeDefined();
        expect(contractById?.id).toEqual(cid);
        expect(contractByAddress?.id).toEqual(cid);

    });
});

