const fs = require("fs");

async function main() {
    console.log("📊 Generating Token CSV with Seed 4567 (perfect distribution)...\n");

    const SEED = 4567;

    // Monster, Item, Background, Effect names
    const monsterNames = ["Vampire", "Dragon", "Frankenstein", "Goblin", "Zombie", "Mummy", "Succubus", "Werewolf", "Demon", "Skeleton"];
    const itemNames = ["Wine", "Sword", "Shield", "Poison", "Arrow", "Staff", "Scythe", "Torch", "Shoulder", "Crown"];
    const backgroundNames = ["Ragnarok", "Abyss", "Corruption", "Bloodmoon", "Venom", "Decay", "Void", "Inferno", "Frost", "Shadow"];
    
    // Original effect order (before remapping)
    const effectNames = ["Seizure", "Mindblast", "Brainwash", "Confusion", "Poisoning", "Blizzard", "Lightning", "Burning", "Bats", "Meteor"];

    // Function to decode token ID using LCG
    function decodeTokenIdLCG(tokenId) {
        const shuffled = ((tokenId - 1) * SEED + 1) % 10000;
        
        const effect = shuffled % 10;
        const item = Math.floor(shuffled / 10) % 10;
        const background = Math.floor(shuffled / 100) % 10;
        const species = Math.floor(shuffled / 1000) % 10;
        
        return { species, background, item, effect };
    }

    // Function to get display effect (with legendary transformations)
    function getDisplayEffect(species, item, background, effect) {
        // Legendary combination 1: Skeleton + Scythe + Shadow + effect 2 → Blackout
        if (species === 9 && item === 6 && background === 9 && effect === 2) {
            return { id: 10, name: "Blackout" };
        }
        
        // Legendary combination 2: Frankenstein + Poison + Venom + effect 7 → Matrix
        if (species === 2 && item === 3 && background === 4 && effect === 7) {
            return { id: 11, name: "Matrix" };
        }
        
        return { id: effect, name: effectNames[effect] };
    }

    // Function to check synergies
    function checkSynergies(monster, item, background, effect) {
        // Quad Synergies
        if (monster === "Dragon" && item === "Crown" && background === "Ragnarok" && effect === "Meteor") {
            return { found: true, title: "Cosmic Sovereign", type: "quad" };
        }
        
        if (monster === "Vampire" && item === "Wine" && background === "Bloodmoon" && effect === "Bats") {
            return { found: true, title: "Crimson Lord", type: "quad" };
        }
        
        // Legendary Effect Synergies
        if (monster === "Skeleton" && item === "Scythe" && background === "Shadow" && effect === "Blackout") {
            return { found: true, title: "Soul Harvester", type: "legendary" };
        }
        
        if (monster === "Frankenstein" && item === "Poison" && background === "Venom" && effect === "Matrix") {
            return { found: true, title: "Toxic Abomination", type: "legendary" };
        }
        
        // Dual Synergies
        if (monster === "Werewolf" && item === "Amulet") {
            return { found: true, title: "The Alpha's Trophy", type: "dual" };
        }
        
        if (monster === "Frankenstein" && item === "Shoulder") {
            return { found: true, title: "The Collector", type: "dual" };
        }
        
        if (monster === "Vampire" && item === "Wine") {
            return { found: true, title: "Blood Sommelier", type: "dual" };
        }
        
        if (monster === "Skeleton" && item === "Scythe") {
            return { found: true, title: "Death's Herald", type: "dual" };
        }
        
        // Curse + Realm Synergies
        if (effect === "Burning" && background === "Inferno") {
            return { found: true, title: "Eternal Flame", type: "dual" };
        }
        
        if (effect === "Blizzard" && background === "Frost") {
            return { found: true, title: "Absolute Zero", type: "dual" };
        }
        
        if (effect === "Poisoning" && background === "Venom") {
            return { found: true, title: "Toxic Miasma", type: "dual" };
        }
        
        if (effect === "Mindblast" && background === "Void") {
            return { found: true, title: "Mental Collapse", type: "dual" };
        }
        
        return { found: false, title: "", type: "none" };
    }

    // Function to generate title
    function generateTitle(monster, background, item, tokenId) {
        const adjectives = ["Ancient", "Cursed", "Eternal", "Forgotten", "Haunted", "Lost", "Mystic", "Sacred", "Shadow", "Twisted"];
        const nouns = ["Bane", "Crown", "Doom", "Echo", "Fate", "Glory", "Horror", "Icon", "Judgement", "King"];
        
        // Simple deterministic title generation
        const adj = adjectives[tokenId % 10];
        const noun = nouns[Math.floor(tokenId / 1000) % 10];
        
        return `${adj} ${noun} #${tokenId}`;
    }

    // Function to calculate rarity
    function calculateRarity(tokenId, synergyType) {
        // Legendary IDs
        const legendaryIds = [1, 7, 13, 23, 42, 86, 100, 111, 187, 217, 333, 404, 555, 616, 666, 777, 911, 999, 1000, 1111, 1337, 1347, 1408, 1492, 1692, 1776, 2187, 3141, 4077, 5150, 6174, 7777, 8128, 9999];
        
        if (legendaryIds.includes(tokenId)) {
            return "Legendary";
        }
        
        if (synergyType === "quad" || synergyType === "legendary") {
            return "Mythic";
        }
        
        // Base rarity calculation
        const roll = (tokenId * 13) % 100;
        
        let baseLevel = 0;
        if (roll < 40) baseLevel = 0; // Common 40%
        else if (roll < 70) baseLevel = 1; // Uncommon 30%
        else if (roll < 85) baseLevel = 2; // Rare 15%
        else if (roll < 95) baseLevel = 3; // Epic 10%
        else baseLevel = 4; // Legendary 5%
        
        // Dual synergy upgrades by 1 level
        if (synergyType === "dual") {
            baseLevel = Math.min(baseLevel + 1, 4);
        }
        
        const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
        return rarityNames[baseLevel];
    }

    // CSV header
    const csvRows = [
        "TokenID,Species,Equipment,Realm,Curse,Name,Story,Rarity,Synergy,SpeciesID,ItemID,BackgroundID,EffectID,OriginalEffectID"
    ];

    console.log("Generating 10,000 rows...");

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        
        const monsterName = monsterNames[species];
        const itemName = itemNames[item];
        const backgroundName = backgroundNames[background];
        const displayEffect = getDisplayEffect(species, item, background, effect);
        const effectName = displayEffect.name;
        
        // Check synergies
        const synergy = checkSynergies(monsterName, itemName, backgroundName, effectName);
        
        // Generate name and story
        let name = synergy.found ? synergy.title : generateTitle(monsterName, backgroundName, itemName, tokenId);
        
        // Simple story generation
        let story = synergy.found ? 
            `A legendary ${monsterName} with extraordinary powers.` :
            `In ${backgroundName}, the ${monsterName} wields ${itemName} with ${effectName} curse.`;
        
        // Calculate rarity
        const rarity = calculateRarity(tokenId, synergy.type);
        
        // Equipment name swap for synergies
        let displayItemName = itemName;
        if (synergy.found && item === 9) displayItemName = "Head";
        else if (synergy.found && item === 8) displayItemName = "Arm";
        
        // Add row
        csvRows.push(
            `${tokenId},${monsterName},${displayItemName},${backgroundName},${effectName},"${name}","${story}",${rarity},"${synergy.title}",${species},${item},${background},${displayEffect.id},${effect}`
        );
        
        if (tokenId % 1000 === 0) {
            console.log(`  Processed ${tokenId}/10000 tokens...`);
        }
    }

    // Write CSV file
    const csvContent = csvRows.join("\n");
    const filename = `token-mapping-seed4567-${Date.now()}.csv`;
    fs.writeFileSync(filename, csvContent);
    
    console.log(`\n✅ CSV generated successfully: ${filename}`);
    console.log(`Total rows: ${csvRows.length} (1 header + 10,000 tokens)`);
    
    // Show special tokens
    console.log("\n🌟 Special Tokens:");
    console.log("  Token #7709: Toxic Abomination (Frankenstein + Poison + Venom + Matrix)");
    console.log("  Token #2784: Soul Harvester (Skeleton + Scythe + Shadow + Blackout)");
    
    // Show first 20 for verification
    console.log("\n📋 First 20 tokens preview:");
    console.log("ID | Species | Item | Background | Effect");
    console.log("---|---------|------|------------|-------");
    
    for (let i = 1; i <= 20; i++) {
        const { species, background, item, effect } = decodeTokenIdLCG(i);
        console.log(`${i.toString().padStart(2)} | ${monsterNames[species].padEnd(11)} | ${itemNames[item].padEnd(8)} | ${backgroundNames[background].padEnd(10)} | ${effectNames[effect]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });