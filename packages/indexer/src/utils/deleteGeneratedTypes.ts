import {join} from "path";
import fs from "fs/promises";

export const deleteGeneratedTypes = async () => {
    try {
        const typesFilePath = join(__dirname, '../types/generated.ts')
        const access =  await fs.access(typesFilePath as string, fs.constants.F_OK)
        console.log("access", access)
        // delere file if exists
        await fs.unlink(typesFilePath as string)
    } catch (error) {
        console.log('Types not generated yet')
    }
}