// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BondageCurve.sol";

contract BondageCurveFactory {
	event BondageCurveCreated(address bondageCurveAddress);

	function deployNewBondageCurve(
		string calldata name,
		string calldata symbol,
		address protocolTreasuryAddress,
		address usdcAddress
	) public returns (address) {
		BondageCurve newBondageCurve = new BondageCurve(
			name,
			symbol,
			protocolTreasuryAddress,
			usdcAddress,
			msg.sender
		);
		emit BondageCurveCreated(address(newBondageCurve));

		return address(newBondageCurve);
	}
}
