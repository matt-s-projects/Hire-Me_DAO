const hre = require("hardhat");

async function main() {

  const HireMeDao = await hre.ethers.getContractFactory("HireMeDao");
  const hiremedao = await HireMeDao.deploy();

  await hiremedao.deployed();

  console.log("HireMeDao deployed to:", hiremedao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
