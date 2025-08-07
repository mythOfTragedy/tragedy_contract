const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Testing Unique Mapping Algorithms...\n");

    // Deploy the example contract
    const UniqueMetadata = await ethers.getContractFactory("UniqueMetadataExample");
    const uniqueMetadata = await UniqueMetadata.deploy();
    await uniqueMetadata.deployed();
    console.log("Contract deployed to:", uniqueMetadata.address);

    // Test Method 1: Feistel Network
    console.log("\n📊 Testing Feistel Network Method:");
    const feistelCombinations = new Set();
    const feistelDuplicates = [];

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const [species, background, item, effect] = await uniqueMetadata.decodeTokenIdFeistel(tokenId);
        const combination = `${species}-${background}-${item}-${effect}`;
        
        if (feistelCombinations.has(combination)) {
            feistelDuplicates.push({ tokenId, combination });
        }
        feistelCombinations.add(combination);
        
        if (tokenId % 1000 === 0) {
            console.log(`  Processed ${tokenId}/10000 tokens...`);
        }
    }

    console.log(`  Unique combinations: ${feistelCombinations.size}/10000`);
    console.log(`  Duplicates found: ${feistelDuplicates.length}`);
    if (feistelDuplicates.length > 0) {
        console.log("  First 5 duplicates:", feistelDuplicates.slice(0, 5));
    }

    // Test Method 2: LCG
    console.log("\n📊 Testing Linear Congruential Generator Method:");
    const lcgCombinations = new Set();
    const lcgDuplicates = [];

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const [species, background, item, effect] = await uniqueMetadata.decodeTokenIdLCG(tokenId);
        const combination = `${species}-${background}-${item}-${effect}`;
        
        if (lcgCombinations.has(combination)) {
            lcgDuplicates.push({ tokenId, combination });
        }
        lcgCombinations.add(combination);
        
        if (tokenId % 1000 === 0) {
            console.log(`  Processed ${tokenId}/10000 tokens...`);
        }
    }

    console.log(`  Unique combinations: ${lcgCombinations.size}/10000`);
    console.log(`  Duplicates found: ${lcgDuplicates.length}`);

    // Verify uniqueness using contract function
    console.log("\n🔍 Verifying uniqueness with contract function:");
    const feistelUnique = await uniqueMetadata.verifyUniqueness(1);
    const lcgUnique = await uniqueMetadata.verifyUniqueness(2);
    
    console.log(`  Feistel method is unique: ${feistelUnique ? '✅' : '❌'}`);
    console.log(`  LCG method is unique: ${lcgUnique ? '✅' : '❌'}`);

    // Check distribution
    console.log("\n📈 Checking distribution (LCG method):");
    const speciesCount = new Array(10).fill(0);
    const backgroundCount = new Array(10).fill(0);
    const itemCount = new Array(10).fill(0);
    const effectCount = new Array(10).fill(0);

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const [species, background, item, effect] = await uniqueMetadata.decodeTokenIdLCG(tokenId);
        speciesCount[species]++;
        backgroundCount[background]++;
        itemCount[item]++;
        effectCount[effect]++;
    }

    console.log("  Species distribution:", speciesCount);
    console.log("  Background distribution:", backgroundCount);
    console.log("  Item distribution:", itemCount);
    console.log("  Effect distribution:", effectCount);

    // Test specific legendary combinations
    console.log("\n🌟 Finding Legendary Combinations:");
    const toxicAbominationTokens = [];
    const soulHarvesterTokens = [];

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const [species, background, item, effect] = await uniqueMetadata.decodeTokenIdLCG(tokenId);
        
        // Toxic Abomination: Frankenstein(2) + Poison(3) + Venom(4) + Seizure(0)
        if (species === 2 && item === 3 && background === 4 && effect === 0) {
            toxicAbominationTokens.push(tokenId);
        }
        
        // Soul Harvester: Skeleton(9) + Scythe(6) + Shadow(9) + Mind Blast(1)
        if (species === 9 && item === 6 && background === 9 && effect === 1) {
            soulHarvesterTokens.push(tokenId);
        }
    }

    console.log(`  Toxic Abomination tokens: ${toxicAbominationTokens.length} - ${toxicAbominationTokens.join(', ')}`);
    console.log(`  Soul Harvester tokens: ${soulHarvesterTokens.length} - ${soulHarvesterTokens.join(', ')}`);

    console.log("\n✅ Test complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });