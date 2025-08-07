const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Quick Test of Legendary Effect Implementation...\n");

    // Get deployed contracts
    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    // Test specific token IDs
    const testTokenIds = [1, 42, 666, 1337, 5000, 9999];

    console.log("📋 Testing decodeTokenId with effect transformation:\n");

    for (const tokenId of testTokenIds) {
        const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
        
        // Calculate base effect for comparison
        const seed = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [tokenId])));
        const baseEffect = seed.shr(24).mod(10).toNumber();
        
        console.log(`Token #${tokenId}:`);
        console.log(`  Species: ${species}, Item: ${item}, Background: ${background}`);
        console.log(`  Base Effect: ${baseEffect} → Transformed Effect: ${effect}`);
        
        // Check if it's a legendary combination
        if (species == 9 && item == 6 && background == 9 && baseEffect == 1) {
            console.log(`  ✅ Soul Harvester detected! Effect transformed to Blackout (${effect})`);
        } else if (species == 2 && item == 3 && background == 4 && baseEffect == 0) {
            console.log(`  ✅ Toxic Abomination detected! Effect transformed to Matrix (${effect})`);
        }
        console.log("");
    }

    // Test getDisplayEffect function directly
    console.log("\n📋 Testing getDisplayEffect function directly:");
    
    // Note: getDisplayEffect is internal, so we'll test through decodeTokenId
    // Create a token that should trigger Soul Harvester
    console.log("\nManual combination tests:");
    
    // Find a token with Soul Harvester combination
    let foundSoulHarvester = false;
    let foundToxicAbomination = false;
    
    for (let i = 1; i <= 100 && (!foundSoulHarvester || !foundToxicAbomination); i++) {
        const [species, background, item, effect] = await metadata.decodeTokenId(i);
        const seed = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [i])));
        const baseEffect = seed.shr(24).mod(10).toNumber();
        
        if (species == 9 && item == 6 && background == 9 && baseEffect == 1 && !foundSoulHarvester) {
            console.log(`\n🎯 Found Soul Harvester at token #${i}!`);
            console.log(`  Effect transformed: ${baseEffect} → ${effect} (should be 10)`);
            foundSoulHarvester = true;
            
            // Get metadata to verify
            const metadataJson = await metadata.getMetadata(i - 1);
            const parsed = JSON.parse(metadataJson);
            console.log(`  Name: ${parsed.name}`);
            console.log(`  Curse attribute: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
        }
        
        if (species == 2 && item == 3 && background == 4 && baseEffect == 0 && !foundToxicAbomination) {
            console.log(`\n🎯 Found Toxic Abomination at token #${i}!`);
            console.log(`  Effect transformed: ${baseEffect} → ${effect} (should be 11)`);
            foundToxicAbomination = true;
            
            // Get metadata to verify
            const metadataJson = await metadata.getMetadata(i - 1);
            const parsed = JSON.parse(metadataJson);
            console.log(`  Name: ${parsed.name}`);
            console.log(`  Curse attribute: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
        }
    }

    if (!foundSoulHarvester) {
        console.log("\n⚠️  No Soul Harvester found in first 100 tokens");
    }
    if (!foundToxicAbomination) {
        console.log("\n⚠️  No Toxic Abomination found in first 100 tokens");
    }

    console.log("\n✅ Quick test complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });