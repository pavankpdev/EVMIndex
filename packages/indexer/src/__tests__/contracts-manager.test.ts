import {ContractsManager} from "../lib/contracts-manager";

describe('ContractsManager class', () => {
    let contractManager: ContractsManager;

    beforeEach(() => {
        contractManager = new ContractsManager();
    });

    it("should be able to create an instance", () => {
        expect(contractManager).toBeInstanceOf(ContractsManager);
    })

    it("should be able to get contracts", async () => {
        const contracts = await contractManager.getContracts();
        expect(contracts).toEqual([])
    })
});