import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts()

  await hre.deployments.deploy("BondageCurveFactory", {
    from: deployer,
    args: [],
    log: true,
  })
}
export default func
func.tags = ["bondageFactory"]
