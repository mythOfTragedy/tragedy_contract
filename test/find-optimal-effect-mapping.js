console.log("🎯 Finding optimal effect ID assignments...\n");

const SEED = 7001;

function decodeTokenId(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// Find all positions
const toxicPositions = [];
const soulPositions = [];

for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        
        if (species === 2 && item === 3 && background === 4 && effect === e) {
            toxicPositions.push({ effect: e, token: i });
        }
        if (species === 9 && item === 6 && background === 9 && effect === e) {
            soulPositions.push({ effect: e, token: i });
        }
    }
}

console.log("All possible positions:");
console.log("\nToxic Abomination (Frankenstein + Poison + Venom):");
toxicPositions.forEach(p => {
    const range = p.token <= 2000 ? "EARLY" : p.token <= 5000 ? "MID" : "LATE";
    console.log(`  Effect ${p.effect}: Token #${p.token} (${range})`);
});

console.log("\nSoul Harvester (Skeleton + Scythe + Shadow):");
soulPositions.forEach(p => {
    const range = p.token <= 2000 ? "EARLY" : p.token <= 5000 ? "MID" : "LATE";
    console.log(`  Effect ${p.effect}: Token #${p.token} (${range})`);
});

// Find best combinations
console.log("\n\n📊 Best combinations for different strategies:");

console.log("\n1. Both in EARLY range (1-2000):");
toxicPositions.filter(t => t.token <= 2000).forEach(toxic => {
    soulPositions.filter(s => s.token <= 2000).forEach(soul => {
        console.log(`  Toxic(effect=${toxic.effect})=#${toxic.token} + Soul(effect=${soul.effect})=#${soul.token}`);
    });
});

console.log("\n2. Both in MID range (2001-5000):");
toxicPositions.filter(t => t.token > 2000 && t.token <= 5000).forEach(toxic => {
    soulPositions.filter(s => s.token > 2000 && s.token <= 5000).forEach(soul => {
        console.log(`  Toxic(effect=${toxic.effect})=#${toxic.token} + Soul(effect=${soul.effect})=#${soul.token}`);
    });
});

console.log("\n3. Balanced (one early, one mid):");
toxicPositions.filter(t => t.token <= 2000).forEach(toxic => {
    soulPositions.filter(s => s.token > 2000 && s.token <= 5000).forEach(soul => {
        const avg = (toxic.token + soul.token) / 2;
        console.log(`  Toxic(effect=${toxic.effect})=#${toxic.token} + Soul(effect=${soul.effect})=#${soul.token} (avg=${avg})`);
    });
});

console.log("\n💡 Recommendations:");
console.log("\nOption A - Both Early:");
console.log("  Seizure → effect=4, Toxic at #1434");
console.log("  Mindblast → effect=5, Soul at #1965");
console.log("  Average position: 1699.5");

console.log("\nOption B - Balanced:");
console.log("  Seizure → effect=7, Toxic at #437");
console.log("  Mindblast → effect=2, Soul at #2962");
console.log("  Average position: 1699.5");

console.log("\nOption C - Both Mid:");
console.log("  Seizure → effect=1, Toxic at #2431");
console.log("  Mindblast → effect=9, Soul at #3969");
console.log("  Average position: 3200");