const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("Testing NFT Minting and Metadata");
  console.log("=".repeat(60));

  const [minter] = await ethers.getSigners();
  console.log("\n📋 Test Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Minter:", minter.address);

  // Read deployment file
  const deploymentFiles = fs.readdirSync('.')
    .filter(f => f.startsWith(`deployment-${hre.network.name}-`))
    .sort()
    .reverse();

  if (deploymentFiles.length === 0) {
    console.error("❌ No deployment file found!");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFiles[0], 'utf8'));
  console.log("📄 Using deployment from:", deploymentFiles[0]);

  if (!deployment.contracts.nft) {
    console.error("❌ NFT contract not found. Run 04-deploy-nft.js first!");
    process.exit(1);
  }

  try {
    // Get contract instance
    const nft = await ethers.getContractAt("TragedyMythNFT", deployment.contracts.nft);
    const metadataContract = await ethers.getContractAt("TragedyMetadata", deployment.contracts.metadata);

    console.log("\n🎨 Testing Single Mint...");
    
    // Mint a single NFT
    const tx = await nft.mint(1, 4, 1, 1); // Goblin + Venom + Sword + Mindblast
    console.log("  📡 Transaction:", tx.hash);
    const receipt = await tx.wait();
    console.log("  ✅ Minted! Gas used:", receipt.gasUsed.toString());
    
    // Extract tokenId from event
    const mintEvent = receipt.events.find(e => e.event === 'TragedyMinted');
    const tokenId = mintEvent.args.tokenId;
    console.log("  🏷️ Token ID:", tokenId.toString());

    // Get token URI
    console.log("\n📝 Retrieving Metadata...");
    const tokenURI = await nft.tokenURI(tokenId);
    console.log("  📏 Token URI length:", tokenURI.length, "characters");
    
    // Decode base64 metadata
    const base64Json = tokenURI.replace('data:application/json;base64,', '');
    const jsonString = Buffer.from(base64Json, 'base64').toString('utf8');
    const metadata = JSON.parse(jsonString);
    
    console.log("\n🔍 Metadata Contents:");
    console.log("  Name:", metadata.name);
    console.log("  Description:", metadata.description);
    console.log("  Image:", metadata.image.substring(0, 50) + "...");
    console.log("  Attributes:");
    metadata.attributes.forEach(attr => {
      console.log(`    - ${attr.trait_type}: ${attr.value}`);
    });

    // Test batch minting
    console.log("\n🎨 Testing Batch Mint...");
    const species = [0, 4, 6, 9]; // Werewolf, Dragon, Vampire, Skeleton
    const backgrounds = [0, 7, 1, 9]; // Bloodmoon, Frost, Abyss, Shadow
    const items = [0, 3, 9, 6]; // Crown, Poison, Amulet, Scythe
    const effects = [0, 6, 8, 4]; // Seizure, Lightning, Burning, Bats
    
    const batchTx = await nft.mintBatch(species, backgrounds, items, effects);
    console.log("  📡 Transaction:", batchTx.hash);
    const batchReceipt = await batchTx.wait();
    console.log("  ✅ Batch minted! Gas used:", batchReceipt.gasUsed.toString());
    
    // Count minted tokens
    const mintEvents = batchReceipt.events.filter(e => e.event === 'TragedyMinted');
    console.log("  🏷️ Tokens minted:", mintEvents.length);
    
    // Check total supply
    const totalSupply = await nft.nextTokenId();
    console.log("\n📊 Total NFTs minted:", totalSupply.sub(1).toString());

    // Save sample metadata
    const sampleFile = `sample-metadata-${Date.now()}.json`;
    fs.writeFileSync(sampleFile, JSON.stringify(metadata, null, 2));
    console.log("💾 Sample metadata saved to:", sampleFile);

    console.log("\n" + "=".repeat(60));
    console.log("MINTING TEST COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n✅ The complete Tragedy NFT system is working!");
    console.log("🎨 NFT Contract:", deployment.contracts.nft);
    console.log("📝 View on chain or use viewer/index.html for visual confirmation");

  } catch (error) {
    console.error("\n❌ Test failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });