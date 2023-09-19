import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
const { SystemProgram } = anchor.web3;
import { Anchorcalculator } from "../target/types/anchorcalculator";
import { Program } from "@coral-xyz/anchor";

describe("Initiliaze", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Anchorcalculator as Program<Anchorcalculator>;


  it("Create calculator", async () => {
    await program.methods.create("Welcome to Solana").accounts({
      calculator: calculator.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).signers([calculator])

    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === "Welcome to Solana")
  });

  it("Add number", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(5)))
  });

  it("Subtract number", async () => {
    await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(1)))
  });

  it("Multiply number", async () => {
    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(6)))
  });

  it("Divide number", async () => {
    await program.rpc.divide(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(1)))
    assert.ok(account.remainder.eq(new anchor.BN(1)))
  });

});
