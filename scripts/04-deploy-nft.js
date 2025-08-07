const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("Deploying Tragedy NFT Contracts");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("\n📋 Deployment Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Deployer:", deployer.address);
  console.log("  Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Read existing deployment
  const deploymentFiles = fs.readdirSync('.')
    .filter(f => f.startsWith(`deployment-${hre.network.name}-`))
    .sort()
    .reverse();

  if (deploymentFiles.length === 0) {
    console.error("❌ No deployment file found. Run 01-deploy-all.js first!");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFiles[0], 'utf8'));
  console.log("📄 Using deployment from:", deploymentFiles[0]);

  try {
    // Step 1: Deploy Metadata Contract
    console.log("\n📝 Step 1/2: Deploying Metadata Contract...");
    const TragedyMetadata = await ethers.getContractFactory("TragedyMetadata");
    const metadata = await TragedyMetadata.deploy(deployment.contracts.composer);
    await metadata.deployed();
    console.log("  ✅ Metadata deployed to:", metadata.address);

    // Step 2: Deploy NFT Contract
    console.log("\n🎨 Step 2/2: Deploying NFT Contract...");
    const TragedyMythNFT = await ethers.getContractFactory("TragedyMythNFT");
    const nft = await TragedyMythNFT.deploy(metadata.address);
    await nft.deployed();
    console.log("  ✅ NFT deployed to:", nft.address);

    // Update deployment log
    deployment.contracts.metadata = metadata.address;
    deployment.contracts.nft = nft.address;
    deployment.nftDeployTime = new Date().toISOString();
    
    const updatedFilename = `deployment-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(updatedFilename, JSON.stringify(deployment, null, 2));
    console.log("\n📄 Updated deployment log:", updatedFilename);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("NFT DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Complete Contract Suite:");
    console.log("  Base64 Library:  ", deployment.contracts.base64);
    console.log("  Monster Bank:    ", deployment.contracts.monsterBank);
    console.log("  Item Bank:       ", deployment.contracts.itemBank);
    console.log("  Background Bank: ", deployment.contracts.backgroundBank);
    console.log("  Effect Bank:     ", deployment.contracts.effectBank);
    console.log("  Composer:        ", deployment.contracts.composer);
    console.log("  Metadata:        ", metadata.address);
    console.log("  NFT:             ", nft.address);
    console.log("\n✅ Ready to mint NFTs!");
    console.log("💡 Next: Run 05-test-minting.js to test the complete system");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });