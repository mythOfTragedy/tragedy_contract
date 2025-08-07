const fs = require("fs");

async function main() {
    console.log("📊 Analyzing Equipment Distribution for Different Seeds...\n");

    // Test multiple seeds
    const testSeeds = [2801, 7001, 3571, 5003, 9901, 4801];

    function decodeTokenIdLCG(tokenId, seed) {
        const shuffled = ((tokenId - 1) * seed + 1) % 10000;
        
        const effect = shuffled % 10;
        const item = Math.floor(shuffled / 10) % 10;
        const background = Math.floor(shuffled / 100) % 10;
        const species = Math.floor(shuffled / 1000) % 10;
        
        return { species, background, item, effect };
    }

    console.log("Checking first 50 tokens for each seed:\n");

    for (const seed of testSeeds) {
        console.log(`\nSeed ${seed}:`);
        console.log("Token | Species | Item | Background | Effect");
        console.log("------|---------|------|------------|-------");
        
        // Track consecutive items
        let prevItem = -1;
        let consecutiveCount = 0;
        let maxConsecutive = 0;
        
        for (let tokenId = 1; tokenId <= 50; tokenId++) {
            const { species, background, item, effect } = decodeTokenIdLCG(tokenId, seed);
            
            // Track consecutive items
            if (item === prevItem) {
                consecutiveCount++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
            } else {
                consecutiveCount = 1;
                prevItem = item;
            }
            
            if (tokenId <= 10) {
                console.log(`${tokenId.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)}`);
            }
        }
        
        // Analyze distribution in first 100 tokens
        const itemCounts = new Array(10).fill(0);
        for (let tokenId = 1; tokenId <= 100; tokenId++) {
            const { item } = decodeTokenIdLCG(tokenId, seed);
            itemCounts[item]++;
        }
        
        console.log(`\nItem distribution in first 100 tokens: [${itemCounts.join(', ')}]`);
        console.log(`Max consecutive same items in first 50: ${maxConsecutive}`);
        
        // Calculate "clustering score" (lower is better)
        let clusterScore = 0;
        for (let i = 1; i < 100; i++) {
            const curr = decodeTokenIdLCG(i, seed).item;
            const next = decodeTokenIdLCG(i + 1, seed).item;
            if (curr === next) clusterScore++;
        }
        console.log(`Clustering score (consecutive pairs in first 100): ${clusterScore}`);
    }

    // Find seeds with better distribution
    console.log("\n\n🔍 Searching for seeds with better item distribution...");
    
    const goodSeeds = [];
    const primes = [1009, 1301, 1601, 2003, 2503, 3001, 3301, 4001, 4507, 5501, 6007, 7901, 8009, 9001];
    
    for (const seed of primes) {
        // Check clustering in first 100
        let clusterScore = 0;
        for (let i = 1; i < 100; i++) {
            const curr = decodeTokenIdLCG(i, seed).item;
            const next = decodeTokenIdLCG(i + 1, seed).item;
            if (curr === next) clusterScore++;
        }
        
        // Also check if legendaries are still early
        let toxicToken = 0;
        let soulToken = 0;
        for (let tokenId = 1; tokenId <= 10000; tokenId++) {
            const { species, background, item, effect } = decodeTokenIdLCG(tokenId, seed);
            if (species === 2 && item === 3 && background === 4 && effect === 0) {
                toxicToken = tokenId;
            }
            if (species === 9 && item === 6 && background === 9 && effect === 1) {
                soulToken = tokenId;
            }
        }
        
        if (clusterScore < 20 && toxicToken < 3000 && soulToken < 3000) {
            goodSeeds.push({ seed, clusterScore, toxicToken, soulToken });
        }
    }
    
    console.log("\nSeeds with better distribution AND early legendaries:");
    goodSeeds.sort((a, b) => a.clusterScore - b.clusterScore);
    goodSeeds.slice(0, 5).forEach(s => {
        console.log(`  Seed ${s.seed}: Clustering=${s.clusterScore}, Toxic=#${s.toxicToken}, Soul=#${s.soulToken}`);
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });