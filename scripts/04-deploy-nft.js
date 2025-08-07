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
    const BankedNFT = await ethers.getContractFactory("BankedNFT");
    const nft = await BankedNFT.deploy(
      "Tragedy NFT: The Mythical Cursed-Nightmare", // name
      "TRAGEDY",                                     // symbol
      10000,                                         // maxSupply
      ethers.utils.parseEther("0.01"),              // mintFee
      250                                           // royaltyRate (2.5%)
    );
    await nft.deployed();
    console.log("  ✅ NFT deployed to:", nft.address);
    
    // Set metadata bank
    console.log("  📝 Setting metadata bank...");
    const tx = await nft.setMetadataBank(metadata.address);
    await tx.wait();
    console.log("  ✅ Metadata bank set!");

    // Update deployment log
    deployment.contracts.metadata = metadata.address;
    deployment.contracts.nft = nft.address;
    deployment.nftDeployTime = new Date().toISOString();
    
    const updatedFilename = `deployment-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(updatedFilename, JSON.stringify(deployment, null, 2));
    console.log("\n📄 Updated deployment log:", updatedFilename);

    // Update viewer deployment.json
    const viewerDeployment = {
      network: hre.network.name,
      timestamp: new Date().toISOString(),
      note: "Auto-updated by NFT deployment script",
      contracts: {
        bankedNFT: nft.address,
        metadata: metadata.address,
        composer: deployment.contracts.composer,
        monsterBank: deployment.contracts.monsterBank,
        itemBank: deployment.contracts.itemBank,
        backgroundBank: deployment.contracts.backgroundBank,
        effectBank: deployment.contracts.effectBank,
        monsterBank1: deployment.contracts.monsterBank1,
        monsterBank2: deployment.contracts.monsterBank2,
        itemBank1: deployment.contracts.itemBank1,
        itemBank2: deployment.contracts.itemBank2
      }
    };
    
    fs.writeFileSync('viewer/deployment.json', JSON.stringify(viewerDeployment, null, 2));
    console.log("📄 Updated viewer/deployment.json");

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