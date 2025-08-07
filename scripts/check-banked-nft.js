const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Checking BankedNFT with account:", deployer.address);
  
  // Known BankedNFT address from deployment
  const BANKED_NFT_ADDRESS = hre.ethers.utils.getAddress("0xe58ed745c4e73e28bbcebaa4910e2230c6422a83");
  
  try {
    // Get BankedNFT contract
    const BankedNFT = await hre.ethers.getContractFactory("BankedNFT");
    const bankedNFT = BankedNFT.attach(BANKED_NFT_ADDRESS);
    
    // Check current metadata bank
    const currentMetadataBank = await bankedNFT.metadataBank();
    console.log("Current MetadataBank:", currentMetadataBank);
    
    // Check other parameters
    const name = await bankedNFT.name();
    const symbol = await bankedNFT.symbol();
    const owner = await bankedNFT.owner();
    
    console.log("\nContract Info:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Owner:", owner);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });