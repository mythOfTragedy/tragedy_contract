const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Checking Legendary Token Metadata...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    // Known legendary tokens from previous search
    const legendaryTokens = [
        { tokenId: 1022, type: "Soul Harvester" },
        { tokenId: 1683, type: "Toxic Abomination" },
        { tokenId: 4211, type: "Toxic Abomination" },
        { tokenId: 4266, type: "Toxic Abomination" }
    ];

    for (const token of legendaryTokens) {
        console.log(`\n📋 Testing ${token.type} - Token #${token.tokenId}:`);
        
        try {
            // Get decoded values
            const [species, background, item, effect] = await metadata.decodeTokenId(token.tokenId);
            console.log(`  Decoded: Species=${species}, Item=${item}, Background=${background}, Effect=${effect}`);
            
            // Try to get metadata
            console.log("\n  Attempting to get metadata...");
            const metadataRaw = await metadata.getMetadata(token.tokenId - 1);
            console.log(`  Raw metadata length: ${metadataRaw.length} characters`);
            console.log(`  First 200 chars: ${metadataRaw.substring(0, 200)}...`);
            
            // Check if it's base64 encoded
            if (metadataRaw.startsWith('data:application/json;base64,')) {
                console.log("  ✅ Metadata is base64 encoded");
                const base64Data = metadataRaw.replace('data:application/json;base64,', '');
                const decodedJson = Buffer.from(base64Data, 'base64').toString('utf-8');
                const parsed = JSON.parse(decodedJson);
                
                console.log(`  Name: ${parsed.name}`);
                console.log(`  Description: ${parsed.description}`);
                console.log(`  Curse: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
                console.log(`  Synergy: ${parsed.attributes.find(a => a.trait_type === "Synergy")?.value || 'None'}`);
            } else {
                // Try to parse as regular JSON
                const parsed = JSON.parse(metadataRaw);
                console.log(`  Name: ${parsed.name}`);
                console.log(`  Description: ${parsed.description}`);
                console.log(`  Curse: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
                console.log(`  Synergy: ${parsed.attributes.find(a => a.trait_type === "Synergy")?.value || 'None'}`);
            }
            
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }
    }

    console.log("\n✅ Metadata check complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });