import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { idl } from "./idl";
import "./App.css";
import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;
const keypair = web3.Keypair.generate();
const programID = new PublicKey("A2E5Gp2ijYhf1F8QRQK5m37PMojef2tsZqTvApS3G6P2");
const connection = new Connection(clusterApiUrl("devnet"), "processed");
const mainProvider = new AnchorProvider(connection, window.solana, "processed");
function App() {
  const [provider, setProvider] = useState(undefined);
  const [walletKey, setWalletKey] = useState(undefined);

  const disconnectWallet = async () => {
    const { solana } = window;

    if (walletKey && solana) {
      await solana.disconnect();
      setWalletKey(undefined);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        console.log("wallet account ", response.publicKey.toString());
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        console.log();
      }
    }
  };

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) return provider;
    }
  };

  const create = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      mainProvider
    );
    console.log({
      calculator: keypair.publicKey,
      user: new PublicKey(walletKey),
      systemProgram: web3.SystemProgram.programId,
    });
    try {
      await program.methods
        .create("Welcome to Solana")
        .accounts({
          calculator: keypair.publicKey,
          user: new PublicKey(walletKey),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([keypair]);

      const account = await program.account.calculator.all();
      console.log(account);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {provider && (
        <button
          style={{
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onClick={connectWallet}
        >
          Connect to Phantom Wallet
        </button>
      )}
      {provider && walletKey && (
        <div>
          <p>Connected account {walletKey}</p>

          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
              margin: "15px auto",
            }}
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
              margin: "15px auto",
            }}
            onClick={create}
          >
            Create
          </button>
        </div>
      )}
    </>
  );
}

export default App;
