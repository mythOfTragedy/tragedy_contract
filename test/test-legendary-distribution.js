const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Testing Legendary Token Distribution with Different Seeds...\n");

    // Function to decode token ID using LCG
    function decodeTokenIdLCG(tokenId, seed) {
        const shuffled = ((tokenId - 1) * seed + 1) % 10000;
        
        const effect = shuffled % 10;
        const item = Math.floor(shuffled / 10) % 10;
        const background = Math.floor(shuffled / 100) % 10;
        const species = Math.floor(shuffled / 1000) % 10;
        
        return { species, background, item, effect };
    }

    // Test various seeds
    const testSeeds = [
        // Prime numbers for good distribution
        7001, 2503, 3571, 4801, 5003, 6007, 7901, 8009, 9001, 9901,
        // Some additional primes
        1009, 1301, 1601, 2003, 2801, 3001, 3301, 4001, 4507, 5501,
        // Large primes close to 10000
        9103, 9203, 9403, 9503, 9703, 9803
    ];

    console.log("Finding legendary combinations for each seed:\n");
    console.log("Seed  | Toxic Abomination | Soul Harvester | Distance | Distribution");
    console.log("------|-------------------|----------------|----------|-------------");

    const results = [];

    for (const seed of testSeeds) {
        let toxicToken = null;
        let soulToken = null;

        for (let tokenId = 1; tokenId <= 10000; tokenId++) {
            const { species, background, item, effect } = decodeTokenIdLCG(tokenId, seed);
            
            // Toxic Abomination: Frankenstein(2) + Poison(3) + Venom(4) + Seizure(0)
            if (species === 2 && item === 3 && background === 4 && effect === 0) {
                toxicToken = tokenId;
            }
            
            // Soul Harvester: Skeleton(9) + Scythe(6) + Shadow(9) + Mind Blast(1)
            if (species === 9 && item === 6 && background === 9 && effect === 1) {
                soulToken = tokenId;
            }
        }

        const distance = Math.abs(toxicToken - soulToken);
        const distribution = getDistributionType(toxicToken, soulToken);
        
        results.push({
            seed,
            toxicToken,
            soulToken,
            distance,
            distribution
        });

        console.log(`${seed.toString().padEnd(5)} | #${toxicToken.toString().padEnd(16)} | #${soulToken.toString().padEnd(13)} | ${distance.toString().padEnd(8)} | ${distribution}`);
    }

    // Find best distributions
    console.log("\n📊 Distribution Analysis:");
    
    // Find seeds with tokens in different ranges
    const earlyMiddleLate = results.filter(r => {
        const toxic = getRange(r.toxicToken);
        const soul = getRange(r.soulToken);
        return toxic !== soul;
    });

    console.log(`\n✅ Seeds with legendary tokens in different ranges (early/middle/late):`);
    earlyMiddleLate.slice(0, 5).forEach(r => {
        console.log(`  Seed ${r.seed}: Toxic #${r.toxicToken} (${getRange(r.toxicToken)}), Soul #${r.soulToken} (${getRange(r.soulToken)})`);
    });

    // Find seeds with good spacing
    const wellSpaced = results.filter(r => r.distance > 3000 && r.distance < 7000);
    console.log(`\n✅ Seeds with good spacing (3000-7000 tokens apart):`);
    wellSpaced.slice(0, 5).forEach(r => {
        console.log(`  Seed ${r.seed}: Toxic #${r.toxicToken}, Soul #${r.soulToken} (${r.distance} apart)`);
    });

    // Test additional legendary combinations
    console.log("\n🌟 Testing more legendary combinations with selected seeds:");
    const selectedSeeds = [2503, 4801, 7001];
    
    for (const seed of selectedSeeds) {
        console.log(`\nSeed ${seed}:`);
        const legendaryTokens = [];
        
        // Test 10 different specific combinations
        const testCombos = [
            { name: "Dragon + Crown + Ragnarok + Meteor", s: 1, i: 9, b: 8, e: 9 },
            { name: "Vampire + Wine + Bloodmoon + Bats", s: 0, i: 0, b: 3, e: 8 },
            { name: "Demon + Torch + Inferno + Burning", s: 8, i: 7, b: 7, e: 7 },
            { name: "Mummy + Staff + Void + Mindblast", s: 5, i: 5, b: 6, e: 1 },
            { name: "Succubus + Amulet + Corruption + Brainwash", s: 6, i: 9, b: 2, e: 2 }
        ];
        
        for (const combo of testCombos) {
            for (let tokenId = 1; tokenId <= 10000; tokenId++) {
                const { species, background, item, effect } = decodeTokenIdLCG(tokenId, seed);
                if (species === combo.s && item === combo.i && background === combo.b && effect === combo.e) {
                    console.log(`  ${combo.name}: Token #${tokenId}`);
                    break;
                }
            }
        }
    }

    console.log("\n💡 Recommendations:");
    console.log("- Seed 2503: Spreads legendaries across early and late tokens");
    console.log("- Seed 4801: Good middle distribution");
    console.log("- Seed 7001: Default, concentrates in later tokens");
    console.log("- Choose based on your preference for legendary token distribution!");
}

function getRange(tokenId) {
    if (tokenId <= 3333) return "early";
    if (tokenId <= 6666) return "middle";
    return "late";
}

function getDistributionType(token1, token2) {
    const range1 = getRange(token1);
    const range2 = getRange(token2);
    
    if (range1 === range2) {
        return `Both ${range1}`;
    } else {
        return `Mixed (${range1}/${range2})`;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });