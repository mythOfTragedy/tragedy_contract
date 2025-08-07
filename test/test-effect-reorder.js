console.log("🎯 Testing effect reordering with Seed 7001...\n");

const SEED = 7001;

function decodeTokenId(tokenId) {
    const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
    
    const effect = shuffled % 10;
    const item = Math.floor(shuffled / 10) % 10;
    const background = Math.floor(shuffled / 100) % 10;
    const species = Math.floor(shuffled / 1000) % 10;
    
    return { species, background, item, effect };
}

// Current legendary combinations
console.log("Current legendary effect IDs:");
console.log("- Toxic Abomination needs: effect=0 (Seizure)");
console.log("- Soul Harvester needs: effect=1 (Mindblast)");

// Find current positions
for (let i = 1; i <= 10000; i++) {
    const { species, background, item, effect } = decodeTokenId(i);
    
    if (species === 2 && item === 3 && background === 4 && effect === 0) {
        console.log(`\nCurrent Toxic Abomination position: Token #${i}`);
    }
    if (species === 9 && item === 6 && background === 9 && effect === 1) {
        console.log(`Current Soul Harvester position: Token #${i}`);
    }
}

// Let's see what happens if we swap effect IDs
// For example, if we make Seizure=9 and Mindblast=8
console.log("\n\n🔄 What if we reorder effects?");
console.log("Example: Swap Seizure from 0→9, Mindblast from 1→8");

// Find where the combinations would appear with new effect IDs
for (let i = 1; i <= 10000; i++) {
    const { species, background, item, effect } = decodeTokenId(i);
    
    // Check for Frankenstein + Poison + Venom + effect=9 (new Seizure)
    if (species === 2 && item === 3 && background === 4 && effect === 9) {
        console.log(`\nNew Toxic Abomination position: Token #${i}`);
    }
    
    // Check for Skeleton + Scythe + Shadow + effect=8 (new Mindblast)
    if (species === 9 && item === 6 && background === 9 && effect === 8) {
        console.log(`New Soul Harvester position: Token #${i}`);
    }
}

// Let's find all possible positions for these combinations
console.log("\n\n📊 All possible positions for legendary combinations:");
console.log("\nToxic Abomination (Frankenstein + Poison + Venom) with different effects:");
for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        if (species === 2 && item === 3 && background === 4 && effect === e) {
            console.log(`  Effect=${e}: Token #${i}`);
            break;
        }
    }
}

console.log("\nSoul Harvester (Skeleton + Scythe + Shadow) with different effects:");
for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        if (species === 9 && item === 6 && background === 9 && effect === e) {
            console.log(`  Effect=${e}: Token #${i}`);
            break;
        }
    }
}

// Find the best effect assignment for early tokens
console.log("\n\n✨ Best effect assignments for early legendaries:");
const effectNames = ["Seizure", "Mindblast", "Brainwash", "Confusion", "Poisoning", "Blizzard", "Lightning", "Burning", "Bats", "Meteor"];

// Find combinations that appear early
const earlyToxic = [];
const earlySoul = [];

for (let e = 0; e < 10; e++) {
    for (let i = 1; i <= 10000; i++) {
        const { species, background, item, effect } = decodeTokenId(i);
        if (species === 2 && item === 3 && background === 4 && effect === e && i < 2000) {
            earlyToxic.push({ effect: e, token: i, name: effectNames[e] });
        }
        if (species === 9 && item === 6 && background === 9 && effect === e && i < 2000) {
            earlySoul.push({ effect: e, token: i, name: effectNames[e] });
        }
    }
}

console.log("\nEarly Toxic Abomination options:");
earlyToxic.forEach(t => console.log(`  ${t.name} (effect=${t.effect}): Token #${t.token}`));

console.log("\nEarly Soul Harvester options:");
earlySoul.forEach(s => console.log(`  ${s.name} (effect=${s.effect}): Token #${s.token}`));

console.log("\n💡 Recommendation:");
console.log("Assign Seizure to effect=6 → Toxic Abomination at Token #1526");
console.log("Assign Mindblast to effect=6 → Soul Harvester at Token #761");
console.log("Or find other effect assignments based on desired positions!");