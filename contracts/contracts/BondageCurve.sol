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
	uint256 public totalMintedTokens;
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

	event TokensBurned(uint256 amountBurned);

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
		contentCreatorBalance = 0;
	}

	function protocolTreasuryBalanceWithdrawal() external onlyOwner {
		require(
			protocolTreasuryBalance > 0,
			"Protocol treasury balance must be greater than 0 to withdraw"
		);
		usdc.transfer(msg.sender, protocolTreasuryBalance);
		protocolTreasuryBalance = 0;
	}

	function purchaseTokens(uint256 usdcAmount) public {
		require(
			usdc.balanceOf(msg.sender) > 0,
			"Must have USDc to purchase tokens"
		);

		require(
			usdc.allowance(msg.sender, address(this)) > usdcAmount,
			"Not enough allowance to purchase tokens"
		);

		usdc.transferFrom(msg.sender, address(this), usdcAmount);

		uint256 tokensToMint = calculatePurchaseReturnPrice(usdcAmount);
		protocolTreasuryBalance += (usdcAmount * 20) / 100;
		contentCreatorBalance += (usdcAmount * 80) / 100;
		totalMintedTokens += tokensToMint;
		_mint(msg.sender, tokensToMint);

		emit TokensPurchased(msg.sender, usdcAmount, tokensToMint);
	}

	function calculatePurchaseReturnPrice(
		uint256 usdcAmount
	) public view returns (uint256) {
		return (usdcAmount * reserveRatio) / (totalMintedTokens + supply);
	}

	function purchaseSubscription() public {
		uint256 subscriptionPriceInTokens = calculateSubscriptionPrice();

		require(
			this.balanceOf(msg.sender) >= subscriptionPriceInTokens,
			"Not enough tokens to purchase subscription"
		);
		require(
			this.allowance(msg.sender, address(this)) >=
				subscriptionPriceInTokens,
			"Not enough allowance to purchase subscription"
		);

		this.burnFrom(msg.sender, subscriptionPriceInTokens);

		emit TokensBurned(subscriptionPriceInTokens);
		emit SubscriptionPurchased(msg.sender);
	}

	function calculateSubscriptionPrice() public view returns (uint256) {
		uint256 subscriptionPriceInTokens = calculatePurchaseReturnPrice(
			fixedSubscriptionPrice
		);
		return subscriptionPriceInTokens;
	}
}
