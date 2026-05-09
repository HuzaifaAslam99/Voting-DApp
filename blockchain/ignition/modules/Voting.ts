import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Ignition module for the Voting contract.
 * This handles the deployment logic and initial state.
 */
const VotingModule = buildModule("VotingModule", (m) => {
  // 1. Define the initial candidates you want to pass to the constructor
  // These match the string[] memory _candidateNames in your Solidity code
  const initialCandidates = ["Alice", "Bob", "Charlie"];

  // 2. Deploy the "Voting" contract
  // The second argument is the array of constructor parameters
  const voting = m.contract("Voting", [initialCandidates]);

  return { voting };
});

export default VotingModule;
