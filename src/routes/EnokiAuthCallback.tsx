// src/routes/EnokiAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";

export default function EnokiAuthCallback() {
  const navigate = useNavigate();
  const { mutateAsync: connect } = useConnectWallet();
  const enokiWallet = useWallets().find(isEnokiWallet);

  useEffect(() => {
    (async () => {
      try {
        if (enokiWallet) {
          await connect({ wallet: enokiWallet });
        }
      } catch (e) {
        console.error("Enoki callback connect failed:", e);
      } finally {
        navigate("/dashboard", { replace: true });
      }
    })();
  }, [connect, enokiWallet, navigate]);

  return <div className="min-h-screen grid place-items-center text-white">Finishing sign-in…</div>;
}
