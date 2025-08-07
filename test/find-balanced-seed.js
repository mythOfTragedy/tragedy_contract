console.log("🔍 Finding seeds with balanced distribution and early legendaries...\n");

function decodeTokenIdLCG(tokenId, seed) {
    const shuffled = ((tokenId - 1) * seed + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// More comprehensive prime list
const primes = [];
for (let n = 1001; n < 10000; n += 2) {
    let isPrime = true;
    for (let d = 3; d * d <= n; d += 2) {
        if (n % d === 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime) primes.push(n);
}

console.log(`Testing ${primes.length} prime seeds...`);

const results = [];

for (const seed of primes) {
    // Find legendary positions
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
    
    // Skip if legendaries are too late
    if (toxicToken > 3000 || soulToken > 3000) continue;
    
    // Calculate clustering score for first 200 tokens
    let maxConsecutive = 0;
    let currentConsecutive = 1;
    let prevItem = decodeTokenIdLCG(1, seed).item;
    
    for (let i = 2; i <= 200; i++) {
        const currItem = decodeTokenIdLCG(i, seed).item;
        if (currItem === prevItem) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 1;
            prevItem = currItem;
        }
    }
    
    // Good if max consecutive is low
    if (maxConsecutive <= 3) {
        results.push({
            seed,
            toxicToken,
            soulToken,
            maxConsecutive,
            avgPosition: (toxicToken + soulToken) / 2
        });
    }
}

// Sort by average legendary position (earlier is better)
results.sort((a, b) => a.avgPosition - b.avgPosition);

console.log("\n✅ Best seeds (early legendaries + good distribution):");
console.log("Seed  | Max Consecutive | Toxic Token | Soul Token | Avg Position");
console.log("------|-----------------|-------------|------------|-------------");

results.slice(0, 10).forEach(r => {
    console.log(`${r.seed} | ${r.maxConsecutive.toString().padStart(15)} | #${r.toxicToken.toString().padStart(10)} | #${r.soulToken.toString().padStart(9)} | ${r.avgPosition.toString().padStart(12)}`);
});

// Show first 20 tokens for best result
if (results.length > 0) {
    const best = results[0];
    console.log(`\nFirst 20 tokens with seed ${best.seed}:`);
    console.log("Token | Species | Item | Background | Effect");
    console.log("------|---------|------|------------|-------");
    
    for (let i = 1; i <= 20; i++) {
        const { species, background, item, effect } = decodeTokenIdLCG(i, best.seed);
        console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)}`);
    }
}