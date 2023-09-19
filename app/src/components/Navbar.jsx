import React from "react";

function Navbar({ provider, walletKey, connectWallet, disconnectWallet }) {
  return (
    <div className="navbar">
      <p className="title">Calculator PRO</p>
      <p className="font">
        {walletKey ? `Connected account ${walletKey}` : ""}
      </p>
      {provider && !walletKey && (
        <button onClick={connectWallet}>Connect to Phantom Wallet</button>
      )}
      {provider && walletKey && (
        <div>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
