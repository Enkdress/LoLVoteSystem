import React from "react";

const WalletButton: React.FC<Props> = ({ walletAddress, connectWallet }) => {
  const onClick = () => {
    if (!walletAddress) {
      connectWallet();
    }
  };

  return (
    <button onClick={onClick}>
      {walletAddress ? walletAddress : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;

interface Props {
  walletAddress: String;
  connectWallet: () => void;
}
