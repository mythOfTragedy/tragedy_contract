const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verifying Seed 4567 Deployment...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    console.log("📍 Deployed Contract:", deploymentData.contracts.metadata);
    console.log("🌱 SHUFFLE_SEED: 4567 (perfect distribution)\n");

    // Check first 30 tokens
    console.log("📊 First 30 tokens distribution:");
    console.log("Token | Species | Item | Background | Effect | Preview");
    console.log("------|---------|------|------------|--------|--------");
    
    const names = ["Vampire", "Dragon", "Frankenstein", "Goblin", "Zombie", "Mummy", "Succubus", "Werewolf", "Demon", "Skeleton"];
    const items = ["Wine", "Sword", "Shield", "Poison", "Arrow", "Staff", "Scythe", "Torch", "Shoulder", "Crown"];
    const backgrounds = ["Ragnarok", "Abyss", "Corruption", "Bloodmoon", "Venom", "Decay", "Void", "Inferno", "Frost", "Shadow"];
    
    const seen = new Set();
    let duplicateCount = 0;
    
    for (let i = 1; i <= 30; i++) {
        const [species, background, item, effect] = await metadata.decodeTokenId(i);
        const preview = `${names[species]} + ${items[item]}`;
        
        // Check for near-duplicates
        const key = `${species}-${item}-${background}`;
        if (seen.has(key)) {
            duplicateCount++;
            console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)} | ${preview} ⚠️`);
        } else {
            console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)} | ${preview}`);
        }
        seen.add(key);
    }
    
    console.log(`\n✅ Near-duplicates in first 30: ${duplicateCount}`);
    
    // Check legendary positions
    console.log("\n🌟 Checking Legendary Positions:");
    
    // Expected with effect remapping
    const expectedToxic = 7709;  // Frankenstein + Poison + Venom + effect 7
    const expectedSoul = 2784;   // Skeleton + Scythe + Shadow + effect 2
    
    for (const tokenId of [expectedToxic, expectedSoul]) {
        const [species, background, item, effect] = await metadata.decodeTokenId(tokenId);
        const name = tokenId === expectedToxic ? "Toxic Abomination" : "Soul Harvester";
        console.log(`\nToken #${tokenId} - ${name}:`);
        console.log(`  ${names[species]} (${species}) + ${items[item]} (${item}) + ${backgrounds[background]} (${background}) + Effect ${effect}`);
        
        if (tokenId === expectedToxic && species === 2 && item === 3 && background === 4 && effect === 11) {
            console.log(`  ✅ Correctly transformed to Matrix effect`);
        } else if (tokenId === expectedSoul && species === 9 && item === 6 && background === 9 && effect === 10) {
            console.log(`  ✅ Correctly transformed to Blackout effect`);
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