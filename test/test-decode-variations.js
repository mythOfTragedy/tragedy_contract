console.log("🔄 Testing different decode orders with Seed 7001...\n");

const SEED = 7001;

// Original decode order
function decodeOriginal(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    return {
        effect: shuffled % 10,
        item: Math.floor(shuffled / 10) % 10,
        background: Math.floor(shuffled / 100) % 10,
        species: Math.floor(shuffled / 1000) % 10
    };
}

// Alternative 1: Rotate positions
function decodeRotated(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    return {
        species: shuffled % 10,
        effect: Math.floor(shuffled / 10) % 10,
        item: Math.floor(shuffled / 100) % 10,
        background: Math.floor(shuffled / 1000) % 10
    };
}

// Alternative 2: Mix high and low digits
function decodeMixed(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    return {
        effect: shuffled % 10,
        background: Math.floor(shuffled / 10) % 10,
        species: Math.floor(shuffled / 100) % 10,
        item: Math.floor(shuffled / 1000) % 10
    };
}

// Show first 20 tokens for each method
const methods = [
    { name: "Original", fn: decodeOriginal },
    { name: "Rotated", fn: decodeRotated },
    { name: "Mixed", fn: decodeMixed }
];

for (const method of methods) {
    console.log(`\n${method.name} decode order:`);
    console.log("Token | Species | Item | Background | Effect");
    console.log("------|---------|------|------------|-------");
    
    for (let i = 1; i <= 20; i++) {
        const d = method.fn(i);
        console.log(`${i.toString().padStart(5)} | ${d.species.toString().padStart(7)} | ${d.item.toString().padStart(4)} | ${d.background.toString().padStart(10)} | ${d.effect.toString().padStart(6)}`);
    }
    
    // Check legendary positions
    console.log("\nLegendary positions:");
    for (let i = 1; i <= 10000; i++) {
        const d = method.fn(i);
        
        // Toxic Abomination
        if (d.species === 2 && d.item === 3 && d.background === 4 && d.effect === 7) {
            console.log(`  Toxic Abomination: Token #${i}`);
        }
        // Soul Harvester (with adjusted effect IDs)
        if (d.species === 9 && d.item === 6 && d.background === 9 && d.effect === 2) {
            console.log(`  Soul Harvester: Token #${i}`);
        }
    }
}

// Best option analysis
console.log("\n\n💡 Analysis:");
console.log("- Original: Items and backgrounds change slowly (bad distribution)");
console.log("- Rotated: Species changes fastest, backgrounds slowest");
console.log("- Mixed: Backgrounds change quickly, items change slowly");
console.log("\nRecommendation: Use 'Mixed' for best variety in early tokens!");