const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Checking Token #1 from on-chain contract...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    console.log("📍 Metadata Contract:", deploymentData.contracts.metadata);
    console.log("🌱 Expected SHUFFLE_SEED: 4567\n");

    // Check token 1
    const tokenId = 1;
    const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
    
    console.log(`Token #${tokenId}:`);
    console.log(`  Species: ${species}`);
    console.log(`  Background: ${background}`);
    console.log(`  Item: ${item}`);
    console.log(`  Effect: ${effect}`);
    
    // Calculate what we expect with seed 4567
    const shuffled = ((tokenId - 1) * 4567 + 1) % 10000;
    console.log(`\nCalculation check:`);
    console.log(`  (${tokenId - 1} * 4567 + 1) % 10000 = ${shuffled}`);
    console.log(`  Expected: ${shuffled} → S=${Math.floor(shuffled/1000)}, B=${Math.floor(shuffled/100)%10}, I=${Math.floor(shuffled/10)%10}, E=${shuffled%10}`);
    
    // Get metadata
    const metadataURI = await metadata.getMetadata(0); // index 0 = token 1
    console.log("\nMetadata URI (first 200 chars):", metadataURI.substring(0, 200) + "...");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });