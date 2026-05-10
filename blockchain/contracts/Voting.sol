// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory _names) {
        for (uint256 i = 0; i < _names.length; i++) {
            candidates.push(Candidate({ name: _names[i], voteCount: 0 }));
        }
    }

    function vote(uint256 index) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(index < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[index].voteCount += 1;
    }

    function candidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 index) external view returns (string memory name, uint256 voteCount) {
        require(index < candidates.length, "Invalid index");
        return (candidates[index].name, candidates[index].voteCount);
    }
}