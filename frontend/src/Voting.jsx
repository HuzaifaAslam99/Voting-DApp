import { useState } from "react";

const CANDIDATES = ["Alice", "Bob", "Charlie"];
const MOCK_VOTES = [4, 7, 2];

export default function VotingApp() {
  const [account, setAccount] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState(MOCK_VOTES);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask first!");
    try {
      const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(addr);
      setStatus("Wallet connected successfully!");
    } catch (err) {
      setStatus("Connection failed.");
    }
  }

  async function castVote() {
    if (!account) return setStatus("Please connect your wallet.");
    if (selected === null) return setStatus("Select a candidate first.");
    if (hasVoted) return setStatus("Limit: One vote per address.");

    // MOCK TRANSACTION LOGIC
    const updated = [...votes];
    updated[selected] += 1;
    setVotes(updated);
    setHasVoted(true);
    setStatus(`Success! Confirmed vote for ${CANDIDATES[selected]}`);
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Voting <span className="text-indigo-600">DApp</span>
          </h1>
          {/* <p className="text-slate-500 text-sm italic">
            On-chain governance · Transparent · Immutable
          </p> */}
        </header>

        {/* 1. Wallet Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">1. Identity</h2>
            <div className={`h-2 w-2 rounded-full ${account ? 'bg-green-500' : 'bg-slate-300 animate-pulse'}`} />
          </div>
          
          {account ? (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Active Account</p>
              <p className="text-sm font-mono break-all text-indigo-700">{account}</p>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              Connect MetaMask
            </button>
          )}
        </section>

        {/* 2. Voting Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">2. Ballot Cast</h2>
          <div className="space-y-3">
            {CANDIDATES.map((name, i) => (
              <button
                key={i}
                disabled={hasVoted}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selected === i 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
                } ${hasVoted && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="font-medium">{name}</span>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected === i ? 'border-indigo-600' : 'border-slate-300'} cursor-pointer`}>
                  {selected === i && <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={castVote}
            disabled={hasVoted || selected === null}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              hasVoted 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-slate-900 hover:bg-black active:scale-[0.98] shadow-slate-200'
            } cursor-pointer`}
          >
            {hasVoted ? "Submission Received" : "Confirm Vote"}
          </button>
        </section>

        {/* 3. Results Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">3. Live Statistics</h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
              TOTAL: {totalVotes}
            </span>
          </div>
          
          <div className="space-y-5">
            {CANDIDATES.map((name, i) => {
              const pct = totalVotes ? Math.round((votes[i] / totalVotes) * 100) : 0;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-700">
                    <span>{name}</span>
                    <span>{votes[i]} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Status Toast */}
        {status && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white border border-indigo-100 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-bounce-short">
            <div className="h-2 w-2 bg-indigo-600 rounded-full" />
            <p className="text-sm font-medium text-slate-700">{status}</p>
          </div>
        )}

      </div>
    </div>
  );
}