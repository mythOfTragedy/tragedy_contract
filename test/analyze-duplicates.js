console.log("🔍 Analyzing duplicate patterns in different seeds...\n");

const testSeeds = [3571, 4567, 6133, 7919, 8923, 9437, 2749, 1009, 5333];

function decodeTokenId(tokenId, seed) {
    const shuffled = ((tokenId - 1) * seed + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// Check for near-duplicates (3 or more attributes same)
function checkNearDuplicates(tokens) {
    const duplicates = [];
    
    for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
            const t1 = tokens[i];
            const t2 = tokens[j];
            
            let sameCount = 0;
            if (t1.species === t2.species) sameCount++;
            if (t1.item === t2.item) sameCount++;
            if (t1.background === t2.background) sameCount++;
            if (t1.effect === t2.effect) sameCount++;
            
            if (sameCount >= 3) {
                duplicates.push({
                    token1: i + 1,
                    token2: j + 1,
                    sameCount,
                    details: `S:${t1.species === t2.species ? '✓' : '✗'} I:${t1.item === t2.item ? '✓' : '✗'} B:${t1.background === t2.background ? '✓' : '✗'} E:${t1.effect === t2.effect ? '✓' : '✗'}`
                });
            }
        }
    }
    
    return duplicates;
}

// Analyze each seed
const results = [];

for (const seed of testSeeds) {
    // Get first 100 tokens
    const tokens = [];
    for (let i = 1; i <= 100; i++) {
        tokens.push(decodeTokenId(i, seed));
    }
    
    // Check for consecutive duplicates
    let maxConsecutive = 0;
    let currentConsecutive = 1;
    
    for (let i = 1; i < 100; i++) {
        const prev = tokens[i-1];
        const curr = tokens[i];
        
        // Count how many attributes are the same
        let sameCount = 0;
        if (prev.species === curr.species) sameCount++;
        if (prev.item === curr.item) sameCount++;
        if (prev.background === curr.background) sameCount++;
        if (prev.effect === curr.effect) sameCount++;
        
        if (sameCount >= 2) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 1;
        }
    }
    
    // Check near-duplicates in first 50
    const first50 = tokens.slice(0, 50);
    const nearDuplicates = checkNearDuplicates(first50);
    
    results.push({
        seed,
        maxConsecutive,
        nearDuplicatesCount: nearDuplicates.length,
        nearDuplicates
    });
}

// Sort by best (least duplicates)
results.sort((a, b) => a.nearDuplicatesCount - b.nearDuplicatesCount);

console.log("Results (sorted by least near-duplicates in first 50):");
console.log("Seed  | Near-Duplicates | Max Consecutive | Details");
console.log("------|-----------------|-----------------|--------");

for (const r of results) {
    console.log(`${r.seed.toString().padStart(5)} | ${r.nearDuplicatesCount.toString().padStart(15)} | ${r.maxConsecutive.toString().padStart(15)} |`);
    
    // Show first few near-duplicates
    if (r.nearDuplicates.length > 0) {
        r.nearDuplicates.slice(0, 3).forEach(d => {
            console.log(`      |                 |                 | Tokens ${d.token1}-${d.token2}: ${d.details}`);
        });
    }
}

// Detailed check for best seed
const best = results[0];
console.log(`\n\n✨ Best seed: ${best.seed}`);
console.log("First 30 tokens:");
console.log("Token | Species | Item | Background | Effect");
console.log("------|---------|------|------------|-------");

for (let i = 1; i <= 30; i++) {
    const d = decodeTokenId(i, best.seed);
    console.log(`${i.toString().padStart(5)} | ${d.species.toString().padStart(7)} | ${d.item.toString().padStart(4)} | ${d.background.toString().padStart(10)} | ${d.effect.toString().padStart(6)}`);
}