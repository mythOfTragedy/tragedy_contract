const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verifying Seed 2801 Distribution...\n");

    const SEED = 2801;

    function decodeTokenIdLCG(tokenId) {
        const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
        
        const effect = shuffled % 10;
        const item = Math.floor(shuffled / 10) % 10;
        const background = Math.floor(shuffled / 100) % 10;
        const species = Math.floor(shuffled / 1000) % 10;
        
        return { species, background, item, effect };
    }

    console.log("🌟 Finding Special Legendary Combinations:");
    console.log("=" .repeat(60));

    // Track all legendary combinations
    const legendaryTokens = [];

    // Toxic Abomination
    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        
        if (species === 2 && item === 3 && background === 4 && effect === 0) {
            console.log(`✅ Toxic Abomination: Token #${tokenId}`);
            legendaryTokens.push({ name: "Toxic Abomination", tokenId });
        }
        
        if (species === 9 && item === 6 && background === 9 && effect === 1) {
            console.log(`✅ Soul Harvester: Token #${tokenId}`);
            legendaryTokens.push({ name: "Soul Harvester", tokenId });
        }
    }

    console.log("\n📊 Distribution Summary:");
    console.log("- Early range (1-3333):");
    const early = legendaryTokens.filter(l => l.tokenId <= 3333);
    early.forEach(l => console.log(`  ${l.name}: #${l.tokenId}`));
    
    console.log("\n- Middle range (3334-6666):");
    const middle = legendaryTokens.filter(l => l.tokenId > 3333 && l.tokenId <= 6666);
    middle.forEach(l => console.log(`  ${l.name}: #${l.tokenId}`));
    
    console.log("\n- Late range (6667-10000):");
    const late = legendaryTokens.filter(l => l.tokenId > 6666);
    late.forEach(l => console.log(`  ${l.name}: #${l.tokenId}`));

    console.log("\n🎯 Other Important Combinations:");
    const otherCombos = [
        { name: "Dragon + Crown + Ragnarok + Meteor", s: 1, i: 9, b: 8, e: 9 },
        { name: "Vampire + Wine + Bloodmoon + Bats", s: 0, i: 0, b: 3, e: 8 },
        { name: "Skeleton + Scythe (base synergy)", s: 9, i: 6, b: null, e: null }
    ];

    for (const combo of otherCombos) {
        for (let tokenId = 1; tokenId <= 5000; tokenId++) { // Check first 5000 only
            const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
            
            if (combo.b === null) {
                // Just check species and item
                if (species === combo.s && item === combo.i) {
                    console.log(`  ${combo.name}: Token #${tokenId} (first occurrence)`);
                    break;
                }
            } else {
                if (species === combo.s && item === combo.i && background === combo.b && effect === combo.e) {
                    console.log(`  ${combo.name}: Token #${tokenId}`);
                    break;
                }
            }
        }
    }

    console.log("\n✅ Perfect! Both special legendaries appear early:");
    console.log("- Toxic Abomination: #1230");
    console.log("- Soul Harvester: #1961");
    console.log("- Both in the first 2000 tokens!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });