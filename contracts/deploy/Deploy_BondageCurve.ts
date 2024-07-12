import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployer, owner } = await hre.getNamedAccounts()

  const mockedUSDC = await hre.deployments.deploy("MockERC20", {
    from: deployer,
    args: ["GabrielBondageToken", "GBT", owner],
    log: true,
  })

  await hre.deployments.deploy("BondageCurve", {
    from: deployer,
    args: ["GabrielBondingCurveToken", "GBCT", owner, mockedUSDC.address, owner],
    log: true,
  })
}
export default func
func.tags = ["bondingcurve"]
