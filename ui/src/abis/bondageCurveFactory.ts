export const BondageCurveFactoryAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "bondageCurveAddress",
        "type": "address"
      }
    ],
    "name": "BondageCurveCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "protocolTreasuryAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "usdcAddress",
        "type": "address"
      }
    ],
    "name": "deployNewBondageCurve",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
