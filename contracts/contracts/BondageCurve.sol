// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract BondageCurve is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
	uint256 public protocolTreasuryBalance;
	uint256 public contentCreatorBalance;
	uint256 public totalMintedTokens = 1;
	uint256 public constant reserveRatio = 1000000; // Reserve ratio in ppm (parts per million)
	uint256 public constant supply = 1000000; // Total supply of tokens
	uint256 public constant fixedSubscriptionPrice = 25; // in usdc
	address public contentCreatorAddress;
	IERC20 public usdc;

	constructor(
		string memory name,
		string memory symbol,
		address initialOwner,
		address usdcAddress,
		address _contentCreatorAddress
	) ERC20(name, symbol) Ownable(initialOwner) {
		usdc = IERC20(usdcAddress);
		contentCreatorAddress = _contentCreatorAddress;
	}

	modifier onlyCreator() {
		require(
			msg.sender == contentCreatorAddress,
			"Only creator address can call this function"
		);
		_;
	}

	function _update(
		address from,
		address to,
		uint256 value
	) internal override(ERC20, ERC20Pausable) onlyOwner {
		super._update(from, to, value);
	}

	event TokensPurchased(
		address indexed buyer,
		uint256 amountSpent,
		uint256 tokensMinted
	);

	event SubscriptionPurchased(address indexed buyer);

	function pause() external onlyOwner {
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}

	function creatorBalanceWithdrawal() external onlyCreator {
		require(
			contentCreatorBalance > 0,
			"Content Creator balance must be greater than 0 to withdraw"
		);
		usdc.transfer(msg.sender, contentCreatorBalance);
	}

	function protocolTreasuryBalanceWithdrawal() external onlyOwner {
		require(
			protocolTreasuryBalance > 0,
			"Protocol treasury balance must be greater than 0 to withdraw"
		);
		usdc.transfer(msg.sender, protocolTreasuryBalance);
	}
}
