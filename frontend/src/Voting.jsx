import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contract_address, voting_abi } from "./constants";

const TARGET_CHAIN_ID = "0x14a34";

const VotingDApp = () => {

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [status, setStatus] = useState("");

  // Whenever contract or hasVoted changes, fetch latest vote counts
  useEffect(() => {
    if (!contract) return;
    async function fetchCandidates() {
      const count = Number(await contract.candidateCount());
      const list = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          contract.getCandidate(i).then(([name, voteCount]) => ({
            name,
            voteCount: Number(voteCount),
          }))
        )
      );
      setCandidates(list);
    }
    fetchCandidates();
  }, [contract, hasVoted]);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Please install MetaMask!");
      return;
    }

    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    if (currentChainId !== TARGET_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    const addr = await signer.getAddress();
    const deployedContract = new ethers.Contract(contract_address, voting_abi, signer);

    setAccount(addr);
    setContract(deployedContract);

    // Check if this wallet already voted
    const voted = await deployedContract.hasVoted(addr);
    setHasVoted(voted);
    setStatus("Wallet connected!");
  }

  async function vote(index) {
    if (hasVoted) return setStatus("You already voted!");
    try {
      setStatus("Sending vote...");
      const tx = await contract.vote(index);
      await tx.wait();
      setHasVoted(true); // this triggers useEffect → fetches new counts
      setStatus(`Voted for ${candidates[index].name}!`);
    } catch (err) {
      setStatus(err.code === "ACTION_REJECTED" ? "Rejected." : err.message);
    }
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow w-full max-w-md p-6 space-y-5">

        <h1 className="text-3xl font-bold text-center text-gray-800">Voting DApp</h1>

        {!account ? (
          <button onClick={connectWallet} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl cursor-pointer">
            Connect MetaMask
          </button>
        ) : (
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl py-2 px-3 text-center font-mono break-all">
            ✅ {account}
          </p>
        )}

        <div className="space-y-3">
          {candidates.length === 0 && (
            <p className="text-center text-gray-400 text-sm">Connect wallet to load candidates...</p>
          )}
          {candidates.map((c, i) => {
            const pct = totalVotes ? Math.round((c.voteCount / totalVotes) * 100) : 0;
            return (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>{c.name}</span>
                  <span>{c.voteCount} votes ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <button
                  onClick={() => vote(i)}
                  disabled={!account || hasVoted}
                  className="w-full py-2 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer transition"
                >
                  {hasVoted ? "Already Voted" : `Vote for ${c.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {status && (
          <p className="text-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl py-2 px-4">
            {status}
          </p>
        )}

      </div>
    </div>
  );
}


export default VotingDApp;
