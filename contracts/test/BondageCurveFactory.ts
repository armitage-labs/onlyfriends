import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"

describe("BondingCurveFactory", () => {
  const setupFixture = deployments.createFixture(async () => {
    await deployments.fixture()
    const signers = await getNamedAccounts()

    const name = "GabrielBondageToken"
    const symbol = "GBCT"
    const owner = signers.deployer

    const mockedUsdcContract = await ethers.deployContract(
      "MockERC20",
      [name, "USDC", owner],
      await ethers.getSigner(signers.deployer)
    )

    const contract = await ethers.deployContract("BondageCurveFactory")

    return {
      contract,
      mockedUsdcContract,
      contractAddress: await contract.getAddress(),
      mockedUsdcContractAddress: await mockedUsdcContract.getAddress(),
      deployer: signers.deployer,
      accounts: await ethers.getSigners(),
      bondingCurveConstructor: {
        name,
        symbol,
        owner,
      },
    }
  })

  it("Should deploy contract properly and function is callable", async () => {
    const { contract } = await setupFixture()

    expect(await contract.getAddress()).to.not.null
  })

  describe("Deploy bonding curve functionality", () => {
    it("Should deploy bonding curve properly", async () => {
      const { contract, mockedUsdcContract, accounts, bondingCurveConstructor } = await setupFixture()

      const usdcAddress = await mockedUsdcContract.getAddress();

      await expect(await contract.connect(accounts[0]).deployNewBondageCurve(
        bondingCurveConstructor.name,
        bondingCurveConstructor.symbol,
        accounts[1],
        usdcAddress
      )).to.emit(contract, "BondageCurveCreated").withArgs("0x75537828f2ce51be7289709686A69CbFDbB714F1");

    });
  });
})
