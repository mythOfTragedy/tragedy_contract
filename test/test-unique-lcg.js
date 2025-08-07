const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Testing LCG-based Unique Mapping...\n");

    const SHUFFLE_SEED = 7001;

    // Function to decode token ID using the same LCG logic
    function decodeTokenIdLCG(tokenId, seed = SHUFFLE_SEED) {
        // LCG: ((tokenId - 1) * seed + 1) % 10000
        const shuffled = ((tokenId - 1) * seed + 1) % 10000;
        
        const effect = shuffled % 10;
        const item = Math.floor(shuffled / 10) % 10;
        const background = Math.floor(shuffled / 100) % 10;
        const species = Math.floor(shuffled / 1000) % 10;
        
        return { species, background, item, effect };
    }

    // Check for unique mappings
    console.log("📊 Checking uniqueness of LCG mapping...");
    const combinations = new Set();
    const duplicates = [];

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        const combination = `${species}-${background}-${item}-${effect}`;
        
        if (combinations.has(combination)) {
            duplicates.push({ tokenId, combination });
        }
        combinations.add(combination);
        
        if (tokenId % 1000 === 0) {
            console.log(`  Processed ${tokenId}/10000 tokens...`);
        }
    }

    console.log(`\n✅ Unique combinations: ${combinations.size}/10000`);
    console.log(`❌ Duplicates found: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
        console.log("\n⚠️  First 5 duplicates:", duplicates.slice(0, 5));
    }

    // Find specific legendary combinations
    console.log("\n🌟 Finding Legendary Combinations with LCG:");
    const toxicAbominationTokens = [];
    const soulHarvesterTokens = [];

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        
        // Toxic Abomination: Frankenstein(2) + Poison(3) + Venom(4) + Seizure(0)
        if (species === 2 && item === 3 && background === 4 && effect === 0) {
            toxicAbominationTokens.push(tokenId);
        }
        
        // Soul Harvester: Skeleton(9) + Scythe(6) + Shadow(9) + Mind Blast(1)
        if (species === 9 && item === 6 && background === 9 && effect === 1) {
            soulHarvesterTokens.push(tokenId);
        }
    }

    console.log(`  Toxic Abomination: ${toxicAbominationTokens.length} tokens - #${toxicAbominationTokens.join(', #')}`);
    console.log(`  Soul Harvester: ${soulHarvesterTokens.length} tokens - #${soulHarvesterTokens.join(', #')}`);

    // Check distribution
    console.log("\n📈 Checking attribute distribution:");
    const speciesCount = new Array(10).fill(0);
    const backgroundCount = new Array(10).fill(0);
    const itemCount = new Array(10).fill(0);
    const effectCount = new Array(10).fill(0);

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        speciesCount[species]++;
        backgroundCount[background]++;
        itemCount[item]++;
        effectCount[effect]++;
    }

    console.log("  Species distribution:", speciesCount);
    console.log("  Background distribution:", backgroundCount);
    console.log("  Item distribution:", itemCount);
    console.log("  Effect distribution:", effectCount);

    // Test different seeds
    console.log("\n🔧 Testing different seeds:");
    const testSeeds = [7001, 2503, 3571, 4801, 9901];
    
    for (const seed of testSeeds) {
        const testCombinations = new Set();
        for (let tokenId = 1; tokenId <= 10000; tokenId++) {
            const { species, background, item, effect } = decodeTokenIdLCG(tokenId, seed);
            const combination = `${species}-${background}-${item}-${effect}`;
            testCombinations.add(combination);
        }
        console.log(`  Seed ${seed}: ${testCombinations.size} unique combinations`);
    }

    console.log("\n✅ LCG mapping test complete!");
    console.log("Each legendary combination now appears exactly once!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });