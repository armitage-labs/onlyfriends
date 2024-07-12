import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"

describe("BondageCurve", () => {
  const setupFixture = deployments.createFixture(async () => {
    await deployments.fixture()
    const signers = await getNamedAccounts()

    const name = "GabeBondageToken"
    const symbol = "GBT"
    const accounts = await ethers.getSigners();
    const owner = signers.deployer

    const mockedUsdcContract = await ethers.deployContract(
      "MockERC20",
      [name, "USDC", owner],
      await ethers.getSigner(signers.deployer)
    )

    const mockedUsdcContractAddress = await mockedUsdcContract.getAddress();

    const contract = await ethers.deployContract(
      "BondageCurve",
      [name, symbol, owner, mockedUsdcContractAddress, accounts[0]],
      await ethers.getSigner(signers.deployer)
    )

    return {
      contract,
      mockedUsdcContract,
      contractAddress: await contract.getAddress(),
      mockedUsdcContractAddress: await mockedUsdcContract.getAddress(),
      deployer: signers.deployer,
      accounts: accounts,
      contractConstructor: {
        name,
        symbol,
        owner,
      },
    }
  })

  it("Should Return Valid Contract Configurations Passed In Constructor", async () => {
    const { contractConstructor, contract } = await setupFixture()

    expect(await contract.name()).to.equal(contractConstructor.name)
    expect(await contract.symbol()).to.equal(contractConstructor.symbol)
    expect(await contract.owner()).to.equal(contractConstructor.owner)
  })


  describe("Access control Functionality", () => {
    it("Should not allow not owner to withdraw creator balance", async () => {
      const { contract, mockedUsdcContract, accounts } = await setupFixture();

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 100000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);

      expect(await contract.totalContractBalance()).to.equal(0);

      await contract.connect(accounts[0]).purchaseTokens(100000);
      expect(await contract.totalContractBalance()).to.equal(100000)
      expect(await contract.contentCreatorBalance()).to.equal(80000)

      await expect(contract.connect(accounts[1]).creatorBalanceWithdrawal()).to.be.revertedWith("Only creator address can call this function");
    });

    it("Should allow owner to withdraw creator balance", async () => {
      const { contract, mockedUsdcContract, accounts } = await setupFixture();

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 100000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);

      expect(await contract.totalContractBalance()).to.equal(0);

      await contract.connect(accounts[0]).purchaseTokens(100000);
      expect(await contract.totalContractBalance()).to.equal(100000)
      expect(await contract.contentCreatorBalance()).to.equal(80000)

      await expect(contract.connect(accounts[0]).creatorBalanceWithdrawal()).to.not.be.reverted;

      expect(await mockedUsdcContract.balanceOf(accounts[0])).to.equal(80000)
    });
  });

  describe("Purchase tokens Functionality", () => {
    it("Should Increase Reserve Balances when purchasing and minting", async () => {
      const { contract, mockedUsdcContract, accounts } = await setupFixture();

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 100000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);
      expect(await contract.totalContractBalance()).to.equal(0);

      await contract.connect(accounts[0]).purchaseTokens(100000);

      expect(await contract.totalContractBalance()).to.equal(100000)
      expect(await contract.contentCreatorBalance()).to.equal(80000)
      expect(await contract.protocolTreasuryBalance()).to.equal(20000)
      expect(await contract.balanceOf(accounts[0].address)).to.equal(100000)
      expect(await contract.totalSupply()).to.equal(100000)
    });

    it("Should Increase token price with multiple mints", async () => {
      const { contract, accounts, mockedUsdcContract } = await setupFixture();

      expect(await contract.totalContractBalance()).to.equal(0);

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 100000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);

      await contract.connect(accounts[0]).purchaseTokens(100000);

      expect(await contract.totalContractBalance()).to.equal(100000)
      expect(await contract.contentCreatorBalance()).to.equal(80000)
      expect(await contract.protocolTreasuryBalance()).to.equal(20000)
      expect(await contract.balanceOf(accounts[0].address)).to.equal(100000)
      expect(await contract.totalSupply()).to.equal(100000)


      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 100000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);
      await contract.connect(accounts[0]).purchaseTokens(100000);
      expect(await contract.totalContractBalance()).to.equal(200000)
      expect(await contract.contentCreatorBalance()).to.equal(160000)
      expect(await contract.protocolTreasuryBalance()).to.equal(40000)
      expect(await contract.balanceOf(accounts[0].address)).to.equal(190909)
      expect(await contract.totalSupply()).to.equal(190909)
    });
  });

  describe("Purchase subscriptions functionality", () => {
    it("Should calculate the subscription price correctly", async () => {
      const { contract, accounts } = await setupFixture();

      const subscriptionPriceInTokens = await contract.connect(accounts[0]).calculateSubscriptionPrice();

      expect(subscriptionPriceInTokens).to.equal(25)
    });
    it("Should decrease the subscription price correctly", async () => {
      const { contract, mockedUsdcContract, accounts } = await setupFixture();

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 1000000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);
      expect(await contract.totalContractBalance()).to.equal(0);

      await contract.connect(accounts[0]).purchaseTokens(100000);

      const subscriptionPriceInTokens = await contract.connect(accounts[0]).calculateSubscriptionPrice();
      expect(subscriptionPriceInTokens).to.equal(22)

      await contract.connect(accounts[0]).purchaseTokens(100000);
      const subscriptionPriceInTokensDecreased = await contract.connect(accounts[0]).calculateSubscriptionPrice();
      expect(subscriptionPriceInTokensDecreased).to.equal(20)
    });
    it("Should burn tokens when purchasing subscription", async () => {
      const { contract, mockedUsdcContract, accounts } = await setupFixture();

      const bondingCurveAddress = await contract.getAddress();
      await mockedUsdcContract.connect(accounts[0]).mint(accounts[0], 1000000);
      await mockedUsdcContract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);
      expect(await contract.totalContractBalance()).to.equal(0);

      await contract.connect(accounts[0]).purchaseTokens(100000);
      //
      const subscriptionPriceInTokens = await contract.connect(accounts[0]).calculateSubscriptionPrice();
      expect(subscriptionPriceInTokens).to.equal(22)
      //
      await contract.connect(accounts[0]).approve(bondingCurveAddress, 1000000);
      await contract.connect(accounts[0]).purchaseSubscription();
      //
      expect(await contract.balanceOf(accounts[0].address)).to.equal(99978)
    });
  });

})
