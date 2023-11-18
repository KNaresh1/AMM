// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./Token.sol";

/**
 * Automated Market Maker
 * Manage Pool, Deposits & Withdraws
 * Facilitate Swaps (i.e Trades)
 */
contract AMM {
    Token public token1;
    Token public token2;

    uint256 constant PRECISION = 10 ** 18;

    uint256 public token1Balance;
    uint256 public token2Balance;
    uint256 public K;

    uint256 public totalShares;
    mapping(address => uint256) public shares;

    constructor(Token _token1, Token _token2) {
        token1 = _token1;
        token2 = _token2;
    }

    function addLiquidity(
        uint256 _token1Amount,
        uint256 _token2Amount
    ) external {
        // Deposit tokens into this contract
        require(
            token1.transferFrom(msg.sender, address(this), _token1Amount),
            "Failed to transfer token1"
        );
        require(
            token2.transferFrom(msg.sender, address(this), _token2Amount),
            "Failed to transfer token2"
        );

        // Issue shares
        uint256 share;

        if (totalShares == 0) {
            // First time adding liquidity, make share 100
            share = 100 * PRECISION;
        } else {
            uint256 share1 = (_token1Amount / token1Balance) * totalShares;
            uint256 share2 = (_token2Amount / token2Balance) * totalShares;

            require(share1 == share2, "Shares not weighed equally");
            share = share1;
        }

        // Manage Pool
        token1Balance += _token1Amount;
        token2Balance += _token2Amount;
        K = token1Balance * token2Balance; // x * y = K

        // Update shares
        totalShares += share;
        shares[msg.sender] += share;
    }
}
