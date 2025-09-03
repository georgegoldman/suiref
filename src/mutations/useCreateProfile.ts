/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSessionData } from "../session-data";
import { Transaction } from "@mysten/sui/transactions";

export function useCreateProfile() {
    const { sharedObject, refresh }  = useSessionData();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    return async function createProfile(username: string, url: string) {
        const poolId = sharedObject?.data?.objectId as string | undefined;
        const initVer = (sharedObject?.data?.owner as any)?.Shared?.initial_shared_version;

        if (!poolId || initVer === undefined) {
            throw new Error("Profile pool is not loaded yet. Try again in a moment.");
        }

        // ASCII-only check for the `std::ascii::String` param
        if (!/^[\x00-\x7F]*$/.test(url)) {
            throw new Error("URL must be ASCII (no unicode characters).");
        }

        const tx = new Transaction();
        const poolRef = tx.sharedObjectRef({
            objectId: poolId,
            initialSharedVersion: Number(initVer),
            mutable: true,
        });

        tx.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::suiref::create_profile`,
      arguments: [
        tx.pure.string(url),       // std::ascii::String (OK to pass as string)
        tx.pure.string(username),  // std::string::String
        poolRef,
      ],
        });

        const res = await signAndExecute({
            transaction: tx,
            chain: "sui:testnet",
            options: {showEffects: true, showEvents: true}
        });

        // Update local cache/UI
        await refresh();
        return res;
    }
}