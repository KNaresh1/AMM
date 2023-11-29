// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./Token.sol";

/**
 * Automated Market Maker (AMM)
 * [X] Manage Pools
 * [X] Manage Deposits
 * [ ] Manage Withdraws
 * [X] Facilitate Swaps (i.e Trades)
 *
 * Eg.
 * Deployer Initially adds: 100,000 DAPP, 100,000 USDC (equal Amount)
 * Liquidity Provider adds: 50,000 DAPP, 50,000 USDC (equal Amount)
 * Now Deployer has: 100 shares and Liquidity Provider has: 50 shares
 * TotalShares: 150
 * As the tokens moves in/out, the price changes and the share determines how many tokens the
 * liquidity providers can get back when they withdraw
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

    event Swap(
        address user,
        address tokenGive,
        uint256 tokenGiveAmount,
        address tokenGet,
        uint256 tokenGetAmount,
        uint256 token1Balance,
        uint256 token2Balance,
        uint256 timestamp
    );

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
            uint256 share1 = (totalShares * _token1Amount) / token1Balance;
            uint256 share2 = (totalShares * _token2Amount) / token2Balance;

            require(
                (share1 / 10 ** 3) == (share2 / 10 ** 3),
                "Must provide equal token amounts"
            );
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

    // Determine how many token2 must be deposited when depositing token1 and viceversa
    function calculateToken2Deposit(
        uint256 _token1Amount
    ) public view returns (uint256 token2Amount) {
        token2Amount = (token2Balance * _token1Amount) / token1Balance;
    }

    function calculateToken1Deposit(
        uint256 _token2Amount
    ) public view returns (uint256 token1Amount) {
        token1Amount = (token1Balance * _token2Amount) / token2Balance;
    }

    function calculateToken1Swap(
        uint256 _token1Amount
    ) public view returns (uint256 token2Amount) {
        // 100 token1 * 100 token2 = 10,000 (x * y = K) - Pool should always contain K
        // y = token2Bal - (K / (x + _token1Amount)), y = 100 token2 - (10,000 / (100 token1 + _token1Amount))
        uint256 token1After = token1Balance + _token1Amount;
        uint token2After = K / token1After;
        token2Amount = token2Balance - token2After;

        // Don't let pool go to 0
        if (token2Amount == token2Balance) {
            token2Amount--;
        }
        require(
            token2Amount < token2Balance,
            "Swap cannot exceed pool balance"
        );
    }

    function swapToken1(
        uint256 _token1Amount
    ) external returns (uint256 token2Amount) {
        // Calculate Token2 amount
        token2Amount = calculateToken1Swap(_token1Amount);

        // Do Swap
        // 1. Transfer token1 tokens out of user wallet to contract
        token1.transferFrom(msg.sender, address(this), _token1Amount);
        // 2. Update token1 balance in the contract
        token1Balance += _token1Amount;
        // 3. Update token2 balance in the contract
        token2Balance -= token2Amount;
        // 4. Transfer token2 tokens from contract to user wallet
        token2.transfer(msg.sender, token2Amount);

        emit Swap(
            msg.sender,
            address(token1),
            _token1Amount,
            address(token2),
            token2Amount,
            token1Balance,
            token2Balance,
            block.timestamp
        );
    }

    function calculateToken2Swap(
        uint256 _token2Amount
    ) public view returns (uint256 token1Amount) {
        uint256 token2After = token2Balance + _token2Amount;
        uint token1After = K / token2After;
        token1Amount = token1Balance - token1After;

        // Don't let pool go to 0
        if (token1Amount == token1Balance) {
            token1Amount--;
        }
        require(
            token1Amount < token1Balance,
            "Swap cannot exceed pool balance"
        );
    }

    function swapToken2(
        uint256 _token2Amount
    ) external returns (uint256 token1Amount) {
        // Calculate Token1 amount
        token1Amount = calculateToken2Swap(_token2Amount);

        // Do Swap
        // 1. Transfer token2 tokens out of user wallet to contract
        token2.transferFrom(msg.sender, address(this), _token2Amount);
        // 2. Update token2 balance in the contract
        token2Balance += _token2Amount;
        // 3. Update token1 balance in the contract
        token1Balance -= token1Amount;
        // 4. Transfer token1 tokens from contract to user wallet
        token1.transfer(msg.sender, token1Amount);

        emit Swap(
            msg.sender,
            address(token2),
            _token2Amount,
            address(token1),
            token1Amount,
            token1Balance,
            token2Balance,
            block.timestamp
        );
    }

    function calculateWithdrawAmount(
        uint256 _share
    ) public view returns (uint256 token1Amount, uint256 token2Amount) {
        require(_share <= totalShares, "Must be less than totalShares");

        token1Amount = (_share * token1Balance) / totalShares;
        token2Amount = (_share * token2Balance) / totalShares;
    }

    // Let liquidity providers withdraw the tokens based on the share
    function removeLiquidity(
        uint256 _share
    ) external returns (uint256 token1Amount, uint256 token2Amount) {
        require(
            _share <= shares[msg.sender],
            "Cannot withdraw more shares than you have"
        );
        (token1Amount, token2Amount) = calculateWithdrawAmount(_share);

        shares[msg.sender] -= _share;
        totalShares -= _share;

        token1Balance -= token1Amount;
        token2Balance -= token2Amount;

        K = token1Balance * token2Balance;

        token1.transfer(msg.sender, token1Amount);
        token2.transfer(msg.sender, token2Amount);

        // Can emit a withdraw event
    }
}
