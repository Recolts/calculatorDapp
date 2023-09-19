import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import { idl } from "./idl";
import { Buffer } from "buffer";
import { Navbar } from "./components";
window.Buffer = Buffer;
const keypair = web3.Keypair.generate();
const programID = new PublicKey("A2E5Gp2ijYhf1F8QRQK5m37PMojef2tsZqTvApS3G6P2");
const connection = new Connection(clusterApiUrl("devnet"), "processed");
const mainProvider = new AnchorProvider(connection, window.solana, "processed");

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [provider, setProvider] = useState(undefined);
  const [walletKey, setWalletKey] = useState(undefined);
  const [hasCalculator, sethasCalculator] = useState(undefined);

  const handleNum1 = (event) => {
    setNum1(event.target.value);
  };
  const handleNum2 = (event) => {
    setNum2(event.target.value);
  };

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

    try {
      await program.methods
        .create("Welcome to Solana")
        .accounts({
          calculator: keypair.publicKey,
          user: new PublicKey(walletKey),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const account = await program.account.calculator.fetch(keypair.publicKey);
      sethasCalculator(true);
      console.log(account);
    } catch (err) {
      console.log(err);
    }
  };

  const add = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      mainProvider
    );

    try {
      await program.methods
        .add(new BN(num1), new BN(num2))
        .accounts({
          calculator: keypair.publicKey,
        })
        .rpc();

      const account = await program.account.calculator.fetch(keypair.publicKey);
      alert(`Result: ${account.result.toNumber()}`);
    } catch (err) {
      console.log(err);
    }
  };

  const subtract = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      mainProvider
    );

    try {
      await program.methods
        .subtract(new BN(num1), new BN(num2))
        .accounts({
          calculator: keypair.publicKey,
        })
        .rpc();

      const account = await program.account.calculator.fetch(keypair.publicKey);
      alert(`Result: ${account.result.toNumber()}`);
    } catch (err) {
      console.log(err);
    }
  };

  const multiply = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      mainProvider
    );

    try {
      await program.methods
        .multiply(new BN(num1), new BN(num2))
        .accounts({
          calculator: keypair.publicKey,
        })
        .rpc();

      const account = await program.account.calculator.fetch(keypair.publicKey);
      alert(`Result: ${account.result.toNumber()}`);
    } catch (err) {
      console.log(err);
    }
  };

  const divide = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      mainProvider
    );

    try {
      await program.methods
        .divide(new BN(num1), new BN(num2))
        .accounts({
          calculator: keypair.publicKey,
        })
        .rpc();

      const account = await program.account.calculator.fetch(keypair.publicKey);
      alert(`Result: ${account.result.toNumber()}`);
      alert(`Remainder: ${account.remainder.toNumber()}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <Navbar
          walletKey={walletKey}
          provider={provider}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
        <div className="calculator_container">
          {hasCalculator ? (
            <div className="calculator">
              <div className="form_input">
                <p>Numbers only</p>
                <input type="text" onChange={handleNum1} value={num1} />
              </div>
              <div className="form_input">
                <p>Numbers only</p>
                <input type="text" onChange={handleNum2} value={num2} />
              </div>
              {provider && walletKey && (
                <div className="button_container">
                  <button onClick={add}>Add</button>
                  <button onClick={subtract}>Subtract</button>
                  <button onClick={multiply}>Multiply</button>
                  <button onClick={divide}>Divide</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={create}>Create</button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
