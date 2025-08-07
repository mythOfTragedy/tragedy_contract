const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing synergies with account:", deployer.address);
  
  // Contract addresses
  const METADATA_V3_ADDRESS = "0xEa4FD4E74AE38e31920d954CcE5a83547a7F7C3F";
  
  // Get TragedyMetadataV3 contract
  const TragedyMetadataV3 = await hre.ethers.getContractFactory("TragedyMetadataV3");
  const metadataV3 = TragedyMetadataV3.attach(METADATA_V3_ADDRESS);
  
  console.log("\nSearching for synergy combinations...\n");
  
  // Test first 1000 token IDs to find synergies
  let foundSynergies = [];
  
  for (let tokenId = 1; tokenId <= 1000; tokenId++) {
    const result = await metadataV3.decodeTokenId(tokenId);
    const species = result[0];
    const background = result[1];
    const item = result[2];
    const effect = result[3];
    
    // Get names from composer's banks
    const composer = await metadataV3.composer();
    const ComposerV4 = await hre.ethers.getContractFactory("ArweaveTragedyComposerV4");
    const composerContract = ComposerV4.attach(composer);
    
    const monsterBank = await composerContract.monsterBank();
    const backgroundBank = await composerContract.backgroundBank();
    const itemBank = await composerContract.itemBank();
    const effectBank = await composerContract.effectBank();
    
    const MonsterBank = await hre.ethers.getContractFactory("ArweaveMonsterBank");
    const BackgroundBank = await hre.ethers.getContractFactory("ArweaveBackgroundBank");
    const ItemBank = await hre.ethers.getContractFactory("ArweaveItemBank");
    const EffectBank = await hre.ethers.getContractFactory("ArweaveEffectBank");
    
    const monsterContract = MonsterBank.attach(monsterBank);
    const backgroundContract = BackgroundBank.attach(backgroundBank);
    const itemContract = ItemBank.attach(itemBank);
    const effectContract = EffectBank.attach(effectBank);
    
    const monsterName = await monsterContract.getMonsterName(species);
    const backgroundName = await backgroundContract.getBackgroundName(background);
    const itemName = await itemContract.getItemName(item);
    const effectName = await effectContract.getEffectName(effect);
    
    // Check some known synergies
    if (
      // Cosmic Sovereign
      (monsterName === "Dragon" && itemName === "Crown" && backgroundName === "Ragnarok" && effectName === "Meteor") ||
      // Soul Harvester
      (monsterName === "Skeleton" && itemName === "Scythe" && backgroundName === "Shadow" && effectName === "Mindblast") ||
      // Crimson Lord
      (monsterName === "Vampire" && itemName === "Wine" && backgroundName === "Bloodmoon" && effectName === "Bats") ||
      // Blood Sommelier (dual)
      (monsterName === "Vampire" && itemName === "Wine") ||
      // Death's Herald (dual)
      (monsterName === "Skeleton" && itemName === "Scythe")
    ) {
      foundSynergies.push({
        tokenId,
        monster: monsterName,
        background: backgroundName,
        item: itemName,
        effect: effectName
      });
      
      if (foundSynergies.length >= 10) break; // Stop after finding 10 synergies
    }
  }
  
  console.log(`Found ${foundSynergies.length} synergies in first 1000 tokens:\n`);
  
  for (const synergy of foundSynergies) {
    console.log(`Token #${synergy.tokenId}: ${synergy.monster} + ${synergy.item} + ${synergy.background} + ${synergy.effect}`);
    
    // Get the actual metadata to see the title
    const metadataUri = await metadataV3.generateMetadata(
      synergy.tokenId,
      await metadataV3.decodeTokenId(synergy.tokenId).then(r => r[0]),
      await metadataV3.decodeTokenId(synergy.tokenId).then(r => r[1]),
      await metadataV3.decodeTokenId(synergy.tokenId).then(r => r[2]),
      await metadataV3.decodeTokenId(synergy.tokenId).then(r => r[3])
    );
    
    // Decode the base64 JSON
    const base64Json = metadataUri.replace('data:application/json;base64,', '');
    const jsonString = Buffer.from(base64Json, 'base64').toString('utf8');
    const metadata = JSON.parse(jsonString);
    
    console.log(`  Title: "${metadata.name}"`);
    console.log(`  Description: "${metadata.description}"`);
    console.log("");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });