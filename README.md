# Voting DApp — Fully Decentralized On-Chain Voting

A zero-backend voting DApp where all logic lives on-chain. 
No server. No database. Just Solidity.

## Live Demo
https://voting-dapp-one-theta.vercel.app

## The Problem It Solves
Traditional voting systems rely on centralized servers — 
meaning results can be manipulated. This DApp enforces 
voting rules directly in a Solidity smart contract on 
Base Sepolia. Once deployed, no one — not even the 
developer — can alter the results.

## How It Works
1. User connects MetaMask wallet
2. Casts vote for a candidate
3. Smart contract enforces **one wallet = one vote** 
   via `mapping(address => bool) public hasVoted`
4. Live vote counts read directly from contract state 
   via Ethers.js — no API calls, no backend

## Key Technical Decision
Vote counts are read directly from the blockchain on 
every render instead of storing state in React. 
This means results are always the source of truth 
from the contract, not the UI.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity + Hardhat |
| Blockchain | Base Sepolia (L2) |
| Frontend | React + Tailwind CSS |
| Web3 Library | Ethers.js |
| Wallet | MetaMask |

## Smart Contract
- Network: Base Sepolia Testnet
- Contract Address: `0x1c654de19E8dE4542eE6194B26cC852D855cE1D5`
- View on Basescan: https://sepolia.basescan.org/address/0x1c654de19E8dE4542eE6194B26cC852D855cE1D5

## Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Smart Contract
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## Project Structure
