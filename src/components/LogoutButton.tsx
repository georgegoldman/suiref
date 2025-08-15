// components/LogoutButton.tsx
import { useDisconnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';

export function LogoutButton() {
  const { mutate: disconnect, isPending } = useDisconnectWallet();
  const acct = useCurrentAccount();
  const navigate = useNavigate();

  if (!acct) return null; // hide if not logged in

  const handleLogout = async () => {
    try {
      await new Promise<void>((resolve, reject) =>
        disconnect(undefined, { onSuccess: () => resolve(), onError: reject }),
      );
      // clear any app tokens here if you set them (cookies/localStorage)
      navigate('/login', { replace: true });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Disconnecting…' : 'Logout'}
    </button>
  );
}
