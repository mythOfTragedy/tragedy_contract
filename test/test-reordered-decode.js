console.log("🔄 Testing reordered decoding (effect ↔ item swap)...\n");

const SEED = 2801;

// Original order
function decodeOriginal(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// New order: swap effect and item positions
function decodeReordered(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    
    const item = shuffled % 10;  // Now item is least significant
    const effect = Math.floor(shuffled / 10) % 10;  // Now effect is second
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

console.log("Original decoding (first 20 tokens):");
console.log("Token | Species | Item | Background | Effect");
console.log("------|---------|------|------------|-------");

for (let i = 1; i <= 20; i++) {
    const { species, background, item, effect } = decodeOriginal(i);
    console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)}`);
}

console.log("\n\nReordered decoding (first 20 tokens):");
console.log("Token | Species | Item | Background | Effect");
console.log("------|---------|------|------------|-------");

for (let i = 1; i <= 20; i++) {
    const { species, background, item, effect } = decodeReordered(i);
    console.log(`${i.toString().padStart(5)} | ${species.toString().padStart(7)} | ${item.toString().padStart(4)} | ${background.toString().padStart(10)} | ${effect.toString().padStart(6)}`);
}

// Check legendary positions with new order
console.log("\n\n🌟 Checking legendary positions with reordered decoding:");

for (let i = 1; i <= 10000; i++) {
    const { species, background, item, effect } = decodeReordered(i);
    
    // Toxic Abomination: Frankenstein(2) + Poison(3) + Venom(4) + Seizure(0)
    if (species === 2 && item === 3 && background === 4 && effect === 0) {
        console.log(`Toxic Abomination: Token #${i}`);
    }
    
    // Soul Harvester: Skeleton(9) + Scythe(6) + Shadow(9) + Mind Blast(1)
    if (species === 9 && item === 6 && background === 9 && effect === 1) {
        console.log(`Soul Harvester: Token #${i}`);
    }
}

// Check item distribution
const itemCounts = new Array(10).fill(0);
for (let i = 1; i <= 100; i++) {
    const { item } = decodeReordered(i);
    itemCounts[item]++;
}

console.log("\nItem distribution in first 100 tokens:");
console.log(itemCounts);

// Check consecutive items
let maxConsecutive = 0;
let currentConsecutive = 1;
let prevItem = decodeReordered(1).item;

for (let i = 2; i <= 100; i++) {
    const { item } = decodeReordered(i);
    if (item === prevItem) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
        currentConsecutive = 1;
        prevItem = item;
    }
}

console.log(`Max consecutive same items: ${maxConsecutive}`);