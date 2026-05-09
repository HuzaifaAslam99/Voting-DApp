// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @notice Simple on-chain voting — one address, one vote.
 *
 * Flow
 * ────
 * 1. Deploy → pass candidate names to constructor.
 * 2. Anyone calls vote(candidateIndex) to cast their vote.
 * 3. hasVoted[address] prevents double-voting.
 * 4. getVotes(index) and getCandidate(index) let the frontend read results.
 */
contract Voting {

    // ── Data structures ───────────────────────────────────────────

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Required line: tracks whether an address has already voted
    mapping(address => bool) public hasVoted;

    Candidate[] public candidates;

    address public owner;          // deployer — can add candidates later
    bool    public votingOpen;     // owner can open / close voting

    // ── Events ────────────────────────────────────────────────────

    event Voted(address indexed voter, uint256 indexed candidateIndex);
    event VotingStatusChanged(bool isOpen);
    event CandidateAdded(string name, uint256 index);

    // ── Modifiers ─────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenOpen() {
        require(votingOpen, "Voting is closed");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────

    /**
     * @param _candidateNames  e.g. ["Alice", "Bob", "Charlie"]
     */
    constructor(string[] memory _candidateNames) {
        owner       = msg.sender;
        votingOpen  = true;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name:      _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    // ── Core functions ────────────────────────────────────────────

    /**
     * @notice Cast a vote for a candidate.
     * @param  candidateIndex  Index in the candidates array (0-based).
     */
    function vote(uint256 candidateIndex) external whenOpen {
        // 1. Must not have voted before
        require(!hasVoted[msg.sender], "Already voted");

        // 2. Index must be valid
        require(candidateIndex < candidates.length, "Invalid candidate");

        // 3. Record the vote
        hasVoted[msg.sender]                    = true;
        candidates[candidateIndex].voteCount   += 1;

        emit Voted(msg.sender, candidateIndex);
    }

    // ── Read functions ────────────────────────────────────────────

    /// @notice Total number of candidates.
    function candidateCount() external view returns (uint256) {
        return candidates.length;
    }

    /// @notice Name and vote count for a candidate.
    function getCandidate(uint256 index)
        external view
        returns (string memory name, uint256 voteCount)
    {
        require(index < candidates.length, "Invalid index");
        Candidate storage c = candidates[index];
        return (c.name, c.voteCount);
    }

    /// @notice Vote count for a candidate (shorthand).
    function getVotes(uint256 index) external view returns (uint256) {
        require(index < candidates.length, "Invalid index");
        return candidates[index].voteCount;
    }

    /**
     * @notice Returns the index of the current leader.
     *         If there's a tie the lower index wins (simple rule).
     */
    function leadingCandidate() external view returns (uint256 index, string memory name) {
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                index    = i;
            }
        }
        name = candidates[index].name;
    }

    // ── Owner functions ───────────────────────────────────────────

    /// @notice Open or close the voting period.
    function setVotingStatus(bool _open) external onlyOwner {
        votingOpen = _open;
        emit VotingStatusChanged(_open);
    }

    /// @notice Add a new candidate (only before or during voting).
    function addCandidate(string calldata _name) external onlyOwner {
        candidates.push(Candidate({ name: _name, voteCount: 0 }));
        emit CandidateAdded(_name, candidates.length - 1);
    }
}



// 0xC5043c882358C76e66F8D9AFAE3e85124a8901f1