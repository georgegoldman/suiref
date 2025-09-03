/* eslint-disable @typescript-eslint/no-unused-vars */
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl('testnet') });


export async function fetchSharedObject(objectId: string) {
    const obj = await client.getObject({
            id: objectId,
            options: { showContent: true, 
            showType: true, 
            showOwner: true, 
            showPreviousTransaction: true, 
            showStorageRebate: true, 
            showDisplay: true 
        }
    });
    return obj;
}

