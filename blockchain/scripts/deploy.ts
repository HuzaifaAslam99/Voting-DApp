import hre from "hardhat";

async function main() {
  console.log("Starting deployment to Base Sepolia...");

  // 1. Define your initial candidates
  const candidateNames = ["Alice", "Bob", "Charlie"];

  // 2. Deploy the "Voting" contract
  // The second argument is an array containing the constructor arguments
  const voting = await (hre as any).viem.deployContract("Voting", [candidateNames]);

  console.log(`Success! Voting contract deployed to: ${voting.address}`);
  console.log(`Initial candidates: ${candidateNames.join(", ")}`);
}

main().catch((error) => {
  console.error("Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});