const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verifying New Legendary Positions...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    console.log("📍 Deployed Contract:", deploymentData.contracts.metadata);
    console.log("🌱 SHUFFLE_SEED: 7001");
    console.log("🔄 Effect Mapping: Seizure→7, Mindblast→2\n");

    // Expected positions
    const expectedPositions = [
        { id: 437, name: "Toxic Abomination", species: 2, item: 3, background: 4, effect: 7 },
        { id: 2962, name: "Soul Harvester", species: 9, item: 6, background: 9, effect: 2 }
    ];

    console.log("🌟 Checking Legendary Tokens:");
    console.log("=" .repeat(70));

    for (const expected of expectedPositions) {
        console.log(`\n🔸 Token #${expected.id} - ${expected.name}:`);
        
        try {
            // Get decoded values
            const [species, background, item, effect] = await metadata.decodeTokenId(expected.id);
            
            console.log(`   Expected: Species=${expected.species}, Item=${expected.item}, Background=${expected.background}, Effect=${expected.effect}`);
            console.log(`   Actual:   Species=${species}, Item=${item}, Background=${background}, Effect=${effect}`);
            
            // Check if it matches
            const matches = species == expected.species && 
                          item == expected.item && 
                          background == expected.background && 
                          effect == expected.effect;
            
            console.log(`   Match: ${matches ? '✅ YES' : '❌ NO'}`);
            
            // Check if transformation happens
            if (matches) {
                if (expected.name === "Toxic Abomination") {
                    console.log(`   Effect transformation: ${effect} → 11 (Matrix)`);
                } else if (expected.name === "Soul Harvester") {
                    console.log(`   Effect transformation: ${effect} → 10 (Blackout)`);
                }
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }

    // Check distribution of first 50 tokens
    console.log("\n\n📊 First 50 tokens distribution:");
    console.log("Token | Species | Item | Background | Effect");
    console.log("------|---------|------|------------|-------");
    
    for (let i = 1; i <= 50; i++) {
        const [species, background, item, effect] = await metadata.decodeTokenId(i);
        if (i <= 10 || i % 10 === 0) {
            console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)}`);
        }
    }

    console.log("\n✅ Verification complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });