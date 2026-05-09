import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import hre from "hardhat";
import { getAddress } from "viem";

describe("Voting Contract", async function () {
  // Following your working project's pattern
  const { viem } = await (network as any).create();
  const publicClient = await viem.getPublicClient();

  it("Should initialize with candidates and allow voting", async function () {
    const [owner, otherAccount] = await viem.getWalletClients();
    
    // 1. Deploy with initial candidates
    const initialCandidates = ["Alice", "Bob"];
    const voting = await viem.deployContract("Voting", [initialCandidates]);

    // 2. Cast a vote using the second account
    await voting.write.vote([0n], { account: otherAccount.account });

    // 3. Verify the vote count
    const [name, voteCount] = await voting.read.getCandidate([0n]);
    
    assert.equal(name, "Alice");
    assert.equal(voteCount, 1n);
  });

  it("Should prevent double voting", async function () {
    const [owner] = await viem.getWalletClients();
    const voting = await viem.deployContract("Voting", [["Alice"]]);

    // Vote once
    await voting.write.vote([0n]);

    // Vote twice - this should throw an error
    await assert.rejects(
      voting.write.vote([0n]),
      { message: /Already voted/ }
    );
  });

  it("Should only allow owner to add candidates", async function () {
    const [owner, otherAccount] = await viem.getWalletClients();
    const voting = await viem.deployContract("Voting", [["Alice"]]);

    // Try to add candidate as non-owner
    await assert.rejects(
      voting.write.addCandidate(["Charlie"], { account: otherAccount.account }),
      { message: /Not owner/ }
    );
  });
});