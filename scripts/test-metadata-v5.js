const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  const metadataAddress = "0xa2D2d62E7B5dDE4864bf44F70eD350064723c1c5";
  const composerAddress = "0x1D845b157b5C4D9C3cA4d0BA9Fc52c97E214DCd0";
  
  console.log("MetadataV5:", metadataAddress);
  console.log("ComposerV5:", composerAddress);

  // Get MetadataV5 contract
  const metadata = await hre.ethers.getContractAt("TragedyMetadataV5", metadataAddress);
  
  try {
    // Test getMetadataCount
    const count = await metadata.getMetadataCount();
    console.log("Metadata count:", count.toString());
    
    // Test composer
    const composerAddr = await metadata.composer();
    console.log("Composer address:", composerAddr);
    
    // Test decodeTokenId
    console.log("\nTesting decodeTokenId for tokenId 1:");
    const decoded = await metadata.decodeTokenId(1);
    console.log("Species:", decoded.species.toString());
    console.log("Background:", decoded.background.toString());
    console.log("Item:", decoded.item.toString());
    console.log("Effect:", decoded.effect.toString());
    
    // Test getMetadata(0)
    console.log("\nTesting getMetadata(0):");
    try {
      const metadata0 = await metadata.getMetadata(0);
      console.log("Success! Metadata:", metadata0.substring(0, 100) + "...");
    } catch (e) {
      console.error("Error calling getMetadata(0):", e.message);
      
      // Try to get more details
      console.log("\nTesting individual components:");
      const composer = await hre.ethers.getContractAt("ArweaveTragedyComposerV5", composerAddr);
      
      // Test banks
      const monsterBank = await composer.monsterBank();
      const backgroundBank = await composer.backgroundBank();
      const itemBank = await composer.itemBank();
      const effectBank = await composer.effectBank();
      
      console.log("MonsterBank:", monsterBank);
      console.log("BackgroundBank:", backgroundBank);
      console.log("ItemBank:", itemBank);
      console.log("EffectBank:", effectBank);
      
      // Test composeSVG directly
      console.log("\nTesting composeSVG(1, 1, 1, 1):");
      try {
        const svg = await composer.composeSVG(1, 1, 1, 1);
        console.log("SVG:", svg.substring(0, 100) + "...");
      } catch (e2) {
        console.error("Error in composeSVG:", e2.message);
      }
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});