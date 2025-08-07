console.log("🔍 Testing larger prime seeds for better distribution...\n");

// Test with larger primes that create more chaotic patterns
const testSeeds = [3571, 4567, 6133, 7919, 8923, 9437];

function decodeTokenId(tokenId, seed) {
    const shuffled = ((tokenId - 1) * seed + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// Analyze distribution for each seed
for (const seed of testSeeds) {
    console.log(`\nSeed ${seed}:`);
    console.log("First 20 tokens:");
    console.log("Token | Species | Item | Background | Effect");
    console.log("------|---------|------|------------|-------");
    
    // Track unique values in first 20
    const uniqueItems = new Set();
    const uniqueBackgrounds = new Set();
    const uniqueSpecies = new Set();
    
    for (let i = 1; i <= 20; i++) {
        const d = decodeTokenId(i, seed);
        uniqueItems.add(d.item);
        uniqueBackgrounds.add(d.background);
        uniqueSpecies.add(d.species);
        
        if (i <= 10) {
            console.log(`${i.toString().padStart(5)} | ${d.species.toString().padStart(7)} | ${d.item.toString().padStart(4)} | ${d.background.toString().padStart(10)} | ${d.effect.toString().padStart(6)}`);
        }
    }
    
    console.log(`Unique in first 20: Items=${uniqueItems.size}/10, Backgrounds=${uniqueBackgrounds.size}/10, Species=${uniqueSpecies.size}/10`);
    
    // Find legendary positions
    let toxicToken = 0;
    let soulToken = 0;
    
    for (let i = 1; i <= 10000; i++) {
        const d = decodeTokenId(i, seed);
        
        if (d.species === 2 && d.item === 3 && d.background === 4 && d.effect === 7) {
            toxicToken = i;
        }
        if (d.species === 9 && d.item === 6 && d.background === 9 && d.effect === 2) {
            soulToken = i;
        }
    }
    
    console.log(`Legendaries: Toxic=#${toxicToken}, Soul=#${soulToken}`);
}

// Special test with 3571 (known to have good distribution)
console.log("\n\n✨ Detailed analysis of Seed 3571:");
console.log("First 30 tokens:");
console.log("Token | Species | Item | Background | Effect | Name Preview");
console.log("------|---------|------|------------|--------|-------------");

const names = ["Vampire", "Dragon", "Frankenstein", "Goblin", "Zombie", "Mummy", "Succubus", "Werewolf", "Demon", "Skeleton"];
const items = ["Wine", "Sword", "Shield", "Poison", "Arrow", "Staff", "Scythe", "Torch", "Shoulder", "Crown"];
const backgrounds = ["Ragnarok", "Abyss", "Corruption", "Bloodmoon", "Venom", "Decay", "Void", "Inferno", "Frost", "Shadow"];

for (let i = 1; i <= 30; i++) {
    const d = decodeTokenId(i, 3571);
    const preview = `${names[d.species]} + ${items[d.item]}`;
    console.log(`${i.toString().padStart(5)} | ${d.species.toString().padStart(7)} | ${d.item.toString().padStart(4)} | ${d.background.toString().padStart(10)} | ${d.effect.toString().padStart(6)} | ${preview}`);
}