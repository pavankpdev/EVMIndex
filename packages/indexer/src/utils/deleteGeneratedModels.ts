import {join} from "path";
import fs from "fs/promises";

export const deleteGeneratedModels = async (fileName: string) => {
    try {
        const modelsFilePath = join(__dirname, `../db/models/${fileName}.ts`)
        await fs.access(modelsFilePath as string, fs.constants.F_OK)
        // delere file if exists
        await fs.unlink(modelsFilePath as string)
    } catch (error) {
        console.log(`Model ${fileName} not generated yet`)
    }
}