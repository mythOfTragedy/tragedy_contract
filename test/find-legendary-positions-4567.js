console.log("🎯 Finding all possible legendary positions with Seed 4567...\n");

const SEED = 4567;

function decodeTokenId(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// Find all positions for each combination
console.log("📊 Toxic Abomination (Frankenstein + Poison + Venom) positions:");
console.log("Effect | Token # | Position");
console.log("-------|---------|----------");

const toxicPositions = [];
for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        if (species === 2 && item === 3 && background === 4 && effect === e) {
            const position = i <= 1000 ? "VERY EARLY" : i <= 3000 ? "EARLY" : i <= 6000 ? "MID" : i <= 8500 ? "LATE" : "VERY LATE";
            console.log(`   ${e}   | #${i.toString().padEnd(6)} | ${position}`);
            toxicPositions.push({ effect: e, token: i });
            break;
        }
    }
}

console.log("\n📊 Soul Harvester (Skeleton + Scythe + Shadow) positions:");
console.log("Effect | Token # | Position");
console.log("-------|---------|----------");

const soulPositions = [];
for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        if (species === 9 && item === 6 && background === 9 && effect === e) {
            const position = i <= 1000 ? "VERY EARLY" : i <= 3000 ? "EARLY" : i <= 6000 ? "MID" : i <= 8500 ? "LATE" : "VERY LATE";
            console.log(`   ${e}   | #${i.toString().padEnd(6)} | ${position}`);
            soulPositions.push({ effect: e, token: i });
            break;
        }
    }
}

console.log("\n💡 Strategic Options:");
console.log("\nOption A - Both Very Early (Seizure→9, Mindblast→5):");
console.log("  Toxic: #109, Soul: #884");

console.log("\nOption B - Progressive Discovery (Seizure→4, Mindblast→6):");
console.log("  Toxic: #3654, Soul: #5684");

console.log("\nOption C - Spread Out (Seizure→1, Mindblast→0):");
console.log("  Toxic: #6309, Soul: #6284");

console.log("\nOption D - Current (Seizure→7, Mindblast→2):");
console.log("  Toxic: #7709, Soul: #2784");

// Find best combinations for different strategies
console.log("\n\n🎲 Custom Combinations:");
console.log("\nFor ~1500 token spacing:");
toxicPositions.forEach(t => {
    soulPositions.forEach(s => {
        const diff = Math.abs(t.token - s.token);
        if (diff >= 1000 && diff <= 2000) {
            console.log(`  Toxic(effect=${t.effect})=#${t.token} + Soul(effect=${s.effect})=#${s.token} (${diff} apart)`);
        }
    });
});

console.log("\nFor both under #1000:");
toxicPositions.filter(t => t.token < 1000).forEach(t => {
    soulPositions.filter(s => s.token < 1000).forEach(s => {
        console.log(`  Toxic(effect=${t.effect})=#${t.token} + Soul(effect=${s.effect})=#${s.token}`);
    });
});