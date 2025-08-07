const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Finding Legendary Tokens by calculating seeds...\n");

    // Function to decode token ID using the same logic as the contract
    function decodeTokenIdLocal(tokenId) {
        const seed = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256"], [tokenId])));
        const species = seed.mod(10).toNumber();
        const background = seed.shr(8).mod(10).toNumber();
        const item = seed.shr(16).mod(10).toNumber();
        const effect = seed.shr(24).mod(10).toNumber();
        return { species, background, item, effect };
    }

    // Find Soul Harvester: Skeleton(9) + Scythe(6) + Shadow(9) + Mind Blast(1)
    console.log("🎯 Searching for Soul Harvester (Skeleton + Scythe + Shadow + Mind Blast)...");
    const soulHarvesterTokens = [];
    
    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLocal(tokenId);
        
        if (species === 9 && item === 6 && background === 9 && effect === 1) {
            soulHarvesterTokens.push(tokenId);
            console.log(`  ✅ Found Soul Harvester at Token #${tokenId}`);
        }
    }

    // Find Toxic Abomination: Frankenstein(2) + Poison(3) + Venom(4) + Seizure(0)
    console.log("\n🎯 Searching for Toxic Abomination (Frankenstein + Poison + Venom + Seizure)...");
    const toxicAbominationTokens = [];
    
    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLocal(tokenId);
        
        if (species === 2 && item === 3 && background === 4 && effect === 0) {
            toxicAbominationTokens.push(tokenId);
            console.log(`  ✅ Found Toxic Abomination at Token #${tokenId}`);
        }
    }

    console.log("\n📊 Summary:");
    console.log(`Soul Harvester tokens found: ${soulHarvesterTokens.length}`);
    console.log(`Toxic Abomination tokens found: ${toxicAbominationTokens.length}`);
    console.log(`Total legendary tokens: ${soulHarvesterTokens.length + toxicAbominationTokens.length}/10000`);

    // Now test these specific tokens with the deployed contract
    if (soulHarvesterTokens.length > 0 || toxicAbominationTokens.length > 0) {
        console.log("\n🧪 Testing with deployed Metadata contract...\n");
        
        const deploymentData = require('../viewer/deployment.json');
        const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

        // Test first Soul Harvester
        if (soulHarvesterTokens.length > 0) {
            const tokenId = soulHarvesterTokens[0];
            console.log(`Testing Soul Harvester Token #${tokenId}:`);
            
            const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
            console.log(`  Contract decoded: Species=${species}, Item=${item}, Background=${background}, Effect=${effect}`);
            console.log(`  Effect should be transformed to 10 (Blackout): ${effect === 10 ? '✅ SUCCESS' : '❌ FAILED'}`);
            
            const metadataJson = await metadata.getMetadata(tokenId - 1);
            const parsed = JSON.parse(metadataJson);
            console.log(`  Name: ${parsed.name}`);
            console.log(`  Curse: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
        }

        // Test first Toxic Abomination
        if (toxicAbominationTokens.length > 0) {
            const tokenId = toxicAbominationTokens[0];
            console.log(`\nTesting Toxic Abomination Token #${tokenId}:`);
            
            const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
            console.log(`  Contract decoded: Species=${species}, Item=${item}, Background=${background}, Effect=${effect}`);
            console.log(`  Effect should be transformed to 11 (Matrix): ${effect === 11 ? '✅ SUCCESS' : '❌ FAILED'}`);
            
            const metadataJson = await metadata.getMetadata(tokenId - 1);
            const parsed = JSON.parse(metadataJson);
            console.log(`  Name: ${parsed.name}`);
            console.log(`  Curse: ${parsed.attributes.find(a => a.trait_type === "Curse").value}`);
        }
    }

    console.log("\n✅ Search complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });