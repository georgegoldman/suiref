// src/mutations/useCreateProfile.ts
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSessionData } from "../session-data";

// ENV: VITE_PACKAGE_ID = your package; VITE_SHARED_OBJECT_ID = ProfilePool object ID
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
const PROFILE_POOL_ID = import.meta.env.VITE_SHARED_OBJECT_ID as string;

export function useCreateProfile() {
  const { refresh } = useSessionData();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  return async (username: string, avatarUrl: string) => {
    if (!PACKAGE_ID || !PROFILE_POOL_ID) {
      throw new Error("Missing env: VITE_PACKAGE_ID / VITE_SHARED_OBJECT_ID");
    }

    const tx = new Transaction();
    // entry fun create_profile(url: std::ascii::String, username: std::string::String, profile_pool: &mut ProfilePool, ctx: &mut TxContext)
    tx.moveCall({
      target: `${PACKAGE_ID}::suiref::create_profile`,
      arguments: [
        tx.pure.string(avatarUrl), // ascii URL
        tx.pure.string(username),
        tx.object(PROFILE_POOL_ID),
      ],
    });

    const res = await signAndExecute({ transaction: tx });
    await refresh(); // re-fetch objects so UI updates
    return res;
  };
}
