const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const initialSupplyAmount = ethers.parseEther("10000");
const initialTokenPrice = ethers.parseEther("0.01");



module.exports = buildModule("MyTokenModule", (m) => {

  const TokenPrice = m.getParameter("TokenPrice", initialTokenPrice);
  const initialSupply = m.getParameter("initialSupply", initialSupplyAmount);

  const token = m.contract("MyToken", [initialSupply, TokenPrice]);
  
  return { token };
});



