const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Testing Legendary Effect Metadata Generation...\n");

    // Get deployed contracts
    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);
    const composer = await ethers.getContractAt("ArweaveTragedyComposer", deploymentData.contracts.composer);

    // Function to find token IDs with specific combinations
    async function findTokensWithCombination(targetSpecies, targetItem, targetBackground, targetEffect) {
        console.log(`\n🔍 Searching for tokens with combination: Species=${targetSpecies}, Item=${targetItem}, Background=${targetBackground}, Effect=${targetEffect}`);
        
        const foundTokens = [];
        for (let tokenId = 1; tokenId <= 10000; tokenId++) {
            const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
            
            // Check base effect (before transformation)
            const seed = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [tokenId])));
            const baseEffect = seed.shr(24).mod(10).toNumber();
            
            if (species == targetSpecies && 
                item == targetItem && 
                background == targetBackground && 
                baseEffect == targetEffect) {
                foundTokens.push({ tokenId, transformedEffect: effect });
                if (foundTokens.length >= 3) break; // Find up to 3 examples
            }
        }
        
        return foundTokens;
    }

    // Test Case 1: Soul Harvester (Skeleton + Scythe + Shadow + Mind Blast → Blackout)
    console.log("\n📋 Test Case 1: Soul Harvester");
    console.log("Expected: Skeleton + Scythe + Shadow + Mind Blast → Blackout (effect 10)");
    
    const soulHarvesterTokens = await findTokensWithCombination(9, 6, 9, 1);
    
    if (soulHarvesterTokens.length > 0) {
        console.log(`✅ Found ${soulHarvesterTokens.length} Soul Harvester tokens!`);
        
        for (const token of soulHarvesterTokens) {
            console.log(`\n🎲 Token #${token.tokenId}:`);
            console.log(`  - Transformed Effect ID: ${token.transformedEffect}`);
            console.log(`  - Expected: 10 (Blackout)`);
            console.log(`  - Transformation: ${token.transformedEffect == 10 ? '✅ SUCCESS' : '❌ FAILED'}`);
            
            // Get metadata
            const metadataJson = await metadata.getMetadata(token.tokenId - 1); // index is tokenId - 1
            const parsedMetadata = JSON.parse(metadataJson);
            
            console.log(`  - Name: ${parsedMetadata.name}`);
            console.log(`  - Description: ${parsedMetadata.description}`);
            console.log(`  - Curse Attribute: ${parsedMetadata.attributes.find(a => a.trait_type === "Curse").value}`);
            console.log(`  - Synergy: ${parsedMetadata.attributes.find(a => a.trait_type === "Synergy")?.value || 'None'}`);
            
            // Check if SVG uses Blackout effect
            const svg = await composer.composeSVG(9, 9, 6, 10);
            console.log(`  - SVG Length: ${svg.length} characters`);
        }
    } else {
        console.log("❌ No Soul Harvester tokens found in first 10000 IDs");
    }

    // Test Case 2: Toxic Abomination (Frankenstein + Poison + Venom + Seizure → Matrix)
    console.log("\n\n📋 Test Case 2: Toxic Abomination");
    console.log("Expected: Frankenstein + Poison + Venom + Seizure → Matrix (effect 11)");
    
    const toxicAbominationTokens = await findTokensWithCombination(2, 3, 4, 0);
    
    if (toxicAbominationTokens.length > 0) {
        console.log(`✅ Found ${toxicAbominationTokens.length} Toxic Abomination tokens!`);
        
        for (const token of toxicAbominationTokens) {
            console.log(`\n🎲 Token #${token.tokenId}:`);
            console.log(`  - Transformed Effect ID: ${token.transformedEffect}`);
            console.log(`  - Expected: 11 (Matrix)`);
            console.log(`  - Transformation: ${token.transformedEffect == 11 ? '✅ SUCCESS' : '❌ FAILED'}`);
            
            // Get metadata
            const metadataJson = await metadata.getMetadata(token.tokenId - 1);
            const parsedMetadata = JSON.parse(metadataJson);
            
            console.log(`  - Name: ${parsedMetadata.name}`);
            console.log(`  - Description: ${parsedMetadata.description}`);
            console.log(`  - Curse Attribute: ${parsedMetadata.attributes.find(a => a.trait_type === "Curse").value}`);
            console.log(`  - Synergy: ${parsedMetadata.attributes.find(a => a.trait_type === "Synergy")?.value || 'None'}`);
            
            // Check if SVG uses Matrix effect
            const svg = await composer.composeSVG(2, 4, 3, 11);
            console.log(`  - SVG Length: ${svg.length} characters`);
        }
    } else {
        console.log("❌ No Toxic Abomination tokens found in first 10000 IDs");
    }

    console.log("\n\n✅ Legendary effect metadata testing complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });