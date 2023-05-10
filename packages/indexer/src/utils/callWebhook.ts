import axios from "axios";

export const callWebhook = async (webhook: string, data: unknown) => {
    console.log(`Calling webhook ${webhook} with data ${data}`)
    return axios.post(webhook, data)
}