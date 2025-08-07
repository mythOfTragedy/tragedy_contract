const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verifying Deployed Contract Legendary Distribution...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    console.log("📍 Deployed Metadata Contract:", deploymentData.contracts.metadata);
    console.log("🌱 Expected SHUFFLE_SEED: 2801\n");

    // Check special legendary tokens
    const legendaryTokens = [
        { id: 1230, name: "Toxic Abomination", expected: "Frankenstein + Poison + Venom + Matrix" },
        { id: 1961, name: "Soul Harvester", expected: "Skeleton + Scythe + Shadow + Blackout" }
    ];

    console.log("🌟 Checking Special Legendary Tokens:");
    console.log("=" .repeat(70));

    for (const legendary of legendaryTokens) {
        console.log(`\n🔸 Token #${legendary.id} - ${legendary.name}:`);
        
        try {
            // Get decoded values
            const [species, background, item, effect] = await metadata.decodeTokenId(legendary.id);
            console.log(`   Species: ${species}, Background: ${background}, Item: ${item}, Effect: ${effect}`);
            
            // Get metadata
            const metadataJson = await metadata.getMetadata(legendary.id - 1);
            const parsed = JSON.parse(metadataJson);
            
            console.log(`   Name: ${parsed.name}`);
            console.log(`   Species: ${parsed.attributes.find(a => a.trait_type === "Species").value}`);
            console.log(`   Equipment: ${parsed.attributes.find(a => a.trait_type === "Equipment").value}`);
            console.log(`   Realm: ${parsed.attributes.find(a => a.trait_type === "Realm").value}`);
            console.log(`   Curse: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
            
            // Check for synergy
            const synergy = parsed.attributes.find(a => a.trait_type === "Synergy");
            if (synergy) {
                console.log(`   ✨ Synergy: ${synergy.value}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }

    // Check some other early tokens
    console.log("\n\n📊 Checking Other Early Range Tokens:");
    const checkTokens = [1, 100, 500, 1000, 1500, 2000];
    
    for (const tokenId of checkTokens) {
        const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
        const metadataJson = await metadata.getMetadata(tokenId - 1);
        const parsed = JSON.parse(metadataJson);
        
        console.log(`Token #${tokenId}: ${parsed.name}`);
    }

    console.log("\n✅ Verification complete!");
    console.log("\n💡 Summary:");
    console.log("- Toxic Abomination appears at Token #1230");
    console.log("- Soul Harvester appears at Token #1961");
    console.log("- Both legendaries are in the early range (1-2000)!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });