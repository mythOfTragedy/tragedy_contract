const fs = require("fs");

async function main() {
    console.log("📊 Generating FINAL Token CSV...\n");
    console.log("Configuration:");
    console.log("- Seed: 4567 (perfect distribution)");
    console.log("- Soul Harvester: #1687");
    console.log("- Toxic Abomination: #2097");
    console.log("- Both use effect=3 (Confusion)\n");

    const SEED = 4567;

    // Monster, Item, Background, Effect names - MUST MATCH ON-CHAIN BANK CONTRACTS!
    const monsterNames = ["Werewolf", "Goblin", "Frankenstein", "Demon", "Dragon", "Zombie", "Vampire", "Mummy", "Succubus", "Skeleton"];
    const itemNames = ["Crown", "Sword", "Shield", "Poison", "Torch", "Wine", "Scythe", "Staff", "Shoulder", "Amulet"];
    const backgroundNames = ["Bloodmoon", "Abyss", "Decay", "Corruption", "Venom", "Void", "Inferno", "Frost", "Ragnarok", "Shadow"];
    
    // Original effect order (before remapping) - MUST MATCH ON-CHAIN BANK CONTRACTS!
    const effectNames = ["Seizure", "Mind Blast", "Confusion", "Meteor", "Bats", "Poisoning", "Lightning", "Blizzard", "Burning", "Brain Wash"];

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
        // Legendary combination 1: Skeleton + Scythe + Shadow + effect 1 (Mind Blast) → Blackout
        if (species === 9 && item === 6 && background === 9 && effect === 1) {
            return { id: 10, name: "Blackout" };
        }
        
        // Note: Matrix transformation is not needed in frontend
        
        return { id: effect, name: effectNames[effect] };
    }

    // Function to check synergies
    function checkSynergies(monster, item, background, effect) {
        // Quad Synergies
        if (monster === "Dragon" && item === "Crown" && background === "Ragnarok" && effect === "Meteor") {
            return { found: true, title: "Cosmic Sovereign", type: "quad", description: "The cosmic ruler who brings the end times. Its crown channels meteor storms that herald the final days." };
        }
        
        if (monster === "Vampire" && item === "Wine" && background === "Bloodmoon" && effect === "Bats") {
            return { found: true, title: "Crimson Lord", type: "quad", description: "Under the blood moon, the crimson ruler commands legions of bats. The ancient vampire lord in its truest form." };
        }
        
        // Legendary Effect Synergies
        if (monster === "Skeleton" && item === "Scythe" && background === "Shadow" && effect === "Mind Blast") {
            return { found: true, title: "Soul Harvester", type: "quad", description: "The ultimate reaper of souls. Its psychic scythe cuts through both flesh and consciousness." };
        }
        
        if (monster === "Frankenstein" && item === "Poison" && background === "Venom" && effect === "Seizure") {
            return { found: true, title: "Toxic Abomination", type: "quad", description: "An undying monster saturated with poison. Its body convulses eternally from the toxins it cannot expel." };
        }
        
        // Add remaining Quad Synergies
        if (monster === "Demon" && item === "Torch" && background === "Inferno" && effect === "Lightning") {
            return { found: true, title: "Hellstorm Avatar", type: "quad", description: "The incarnation of hell's tempest. Lightning-wreathed flames announce its apocalyptic arrival." };
        }
        
        if (monster === "Succubus" && item === "Magic Wand" && background === "Corruption" && effect === "Brain Wash") {
            return { found: true, title: "Mind Empress", type: "quad", description: "The corrupted empress who enslaves minds. Her wand weaves thoughts into chains of eternal servitude." };
        }
        
        if (monster === "Mummy" && item === "Sword" && background === "Void" && effect === "Burning") {
            return { found: true, title: "Eternal Warrior", type: "quad", description: "An immortal ancient warrior wrapped in void flames. Time means nothing to this burning guardian." };
        }
        
        if (monster === "Werewolf" && item === "Head" && background === "Abyss" && effect === "Confusion") {
            return { found: true, title: "Lunatic Alpha", type: "quad", description: "The pack leader consumed by abyssal madness. It carries trophies of those who challenged its insanity." };
        }
        
        if (monster === "Zombie" && item === "Arm" && background === "Decay" && effect === "Poisoning") {
            return { found: true, title: "Rotting Collector", type: "quad", description: "A putrid corpse collector spreading toxic decay. Each arm in its collection tells a story of plague." };
        }
        
        if (monster === "Goblin" && item === "Shield" && background === "Frost" && effect === "Blizzard") {
            return { found: true, title: "Frozen Guardian", type: "quad", description: "The ice sprite defending eternal permafrost. Its shield channels blizzards that freeze time itself." };
        }
        
        // Dual Synergies - Equipment transformations
        if (monster === "Werewolf" && item === "Head") {
            return { found: true, title: "The Alpha's Trophy", type: "dual", description: "What appears to be a simple crown is revealed as the severed head of the previous pack leader." };
        }
        
        if (monster === "Frankenstein" && item === "Arm") {
            return { found: true, title: "The Collector", type: "dual", description: "The shoulder armor is actually a collection of harvested arms, still twitching with unnatural life." };
        }
        
        if (monster === "Vampire" && item === "Wine") {
            return { found: true, title: "Blood Sommelier", type: "dual", description: "A refined predator who has transcended mere survival. This vampire has cultivated an exquisite palate for the finest vintages." };
        }
        
        if (monster === "Skeleton" && item === "Scythe") {
            return { found: true, title: "Death's Herald", type: "dual", description: "The original harbinger of doom. This skeletal reaper has collected souls since the dawn of mortality itself." };
        }
        
        // Curse + Realm Synergies
        if (effect === "Burning" && background === "Inferno") {
            return { found: true, title: "Eternal Flame", type: "dual", description: "Fire that burns without fuel, consuming reality itself." };
        }
        
        if (effect === "Blizzard" && background === "Frost") {
            return { found: true, title: "Absolute Zero", type: "dual", description: "Where ice meets storm, nothing survives." };
        }
        
        if (effect === "Poisoning" && background === "Venom") {
            return { found: true, title: "Toxic Miasma", type: "dual", description: "A poisonous fog that corrupts all it touches." };
        }
        
        if (effect === "Mindblast" && background === "Void") {
            return { found: true, title: "Mental Collapse", type: "dual", description: "The void between thoughts where sanity dies." };
        }
        
        if (effect === "Lightning" && background === "Bloodmoon") {
            return { found: true, title: "Crimson Thunder", type: "dual", description: "Blood-red lightning that strikes with divine wrath." };
        }
        
        if (effect === "Brainwash" && background === "Corruption") {
            return { found: true, title: "Mind Corruption", type: "dual", description: "Thoughts twisted into weapons against their owner." };
        }
        
        if (effect === "Meteor" && background === "Ragnarok") {
            return { found: true, title: "Apocalypse Rain", type: "dual", description: "The sky falls, bringing the end of all things." };
        }
        
        if (effect === "Bats" && background === "Shadow") {
            return { found: true, title: "Night Terror", type: "dual", description: "Living shadows that feast on fear." };
        }
        
        if (effect === "Confusion" && background === "Decay") {
            return { found: true, title: "Madness Plague", type: "dual", description: "A disease that rots both mind and body." };
        }
        
        if (effect === "Seizure" && background === "Abyss") {
            return { found: true, title: "Deep Tremor", type: "dual", description: "Convulsions from staring too long into the infinite dark." };
        }
        
        return { found: false, title: "", type: "none", description: "" };
    }

    // Function to generate title - matches NarrativeGenerator.sol
    function generateTitle(monster, background, item, tokenId) {
        let titlePrefix = "";
        let titleCore = "";
        
        // Special prefixes for certain backgrounds
        if (background === "Ragnarok") titlePrefix = "Last ";
        else if (background === "Void") titlePrefix = "Void ";
        else if (background === "Corruption") titlePrefix = "Corrupted ";
        else if (background === "Bloodmoon") titlePrefix = "Crimson ";
        else if (background === "Inferno") titlePrefix = "Infernal ";
        else if (background === "Frost") titlePrefix = "Frozen ";
        
        // Generate core title based on monster and item
        if (monster === "Dragon") {
            if (item === "Sword") titleCore = "Wyrm Knight";
            else if (item === "Shield") titleCore = "Scale Guardian";
            else if (item === "Crown") titleCore = "Drake Lord";
            else titleCore = "Ancient Wyrm";
        } else if (monster === "Vampire") {
            if (item === "Wine") titleCore = "Blood Noble";
            else if (item === "Crown") titleCore = "Night King";
            else titleCore = "Eternal Hunter";
        } else if (monster === "Skeleton") {
            if (item === "Scythe") titleCore = "Bone Reaper";
            else if (item === "Shield") titleCore = "Undead Sentinel";
            else titleCore = "Hollow One";
        } else if (monster === "Demon") {
            if (item === "Torch") titleCore = "Flame Bearer";
            else if (item === "Sword") titleCore = "Hell Blade";
            else titleCore = "Fiend Lord";
        } else if (monster === "Werewolf") {
            if (item === "Amulet") titleCore = "Pack Alpha";
            else if (item === "Shoulder") titleCore = "Beast Warrior";
            else titleCore = "Moon Stalker";
        } else if (monster === "Zombie") {
            if (item === "Poison") titleCore = "Plague Walker";
            else if (item === "Amulet") titleCore = "Cursed Corpse";
            else titleCore = "Shambling Dead";
        } else if (monster === "Mummy") {
            if (item === "Staff") titleCore = "Tomb Priest";
            else if (item === "Sword") titleCore = "Desert Warrior";
            else titleCore = "Ancient Guard";
        } else if (monster === "Succubus") {
            if (item === "Wine") titleCore = "Desire Maiden";
            else if (item === "Staff") titleCore = "Dream Weaver";
            else titleCore = "Soul Temptress";
        } else if (monster === "Frankenstein") {
            if (item === "Shoulder") titleCore = "Flesh Sculptor";
            else if (item === "Poison") titleCore = "Toxic Creation";
            else titleCore = "Stitched Horror";
        } else { // Goblin
            if (item === "Sword") titleCore = "Cave Raider";
            else if (item === "Shield") titleCore = "Tribal Guard";
            else titleCore = "Shadow Gremlin";
        }
        
        return `${titlePrefix}${titleCore} #${tokenId}`;
    }

    // Function to get narrative description - matches contract
    function getNarrativeDescription(monster, background, item, effect) {
        const realmPrefix = getRealmPrefix(background);
        const monsterAction = getMonsterAction(monster, item);
        const curseDescription = getCurseDescription(effect);
        
        return `${realmPrefix} ${monsterAction} ${curseDescription}`;
    }
    
    function getRealmPrefix(background) {
        if (background === "Bloodmoon") return "Under the crimson gaze,";
        else if (background === "Abyss") return "From the endless void,";
        else if (background === "Decay") return "In rotting wastelands,";
        else if (background === "Corruption") return "Where reality breaks,";
        else if (background === "Venom") return "In toxic mists,";
        else if (background === "Void") return "At existence's edge,";
        else if (background === "Inferno") return "Within eternal flames,";
        else if (background === "Frost") return "In frozen wastes,";
        else if (background === "Ragnarok") return "As the world ends,";
        else return "In shadow's reach,";
    }
    
    function getMonsterAction(monster, item) {
        if (monster === "Dragon") {
            if (item === "Crown") return "the wyrm reclaims dominion";
            else if (item === "Sword") return "the drake wields dragonfire steel";
            else return "this terror hoards cursed treasures";
        } else if (monster === "Vampire") {
            if (item === "Wine") return "the noble savors crimson vintage";
            else if (item === "Crown") return "the night king commands darkness";
            else return "this nightwalker hunts eternally";
        } else if (monster === "Skeleton") {
            if (item === "Scythe") return "death's herald reaps souls";
            else if (item === "Shield") return "the undead sentinel stands watch";
            else return "ancient bones clutch their relics";
        } else if (monster === "Demon") {
            if (item === "Torch") return "the hellspawn lights perdition's path";
            else if (item === "Sword") return "this fiend wields torment";
            else return "the infernal lord reigns";
        } else if (monster === "Werewolf") {
            return "the beast stalks with primal fury";
        } else if (monster === "Zombie") {
            if (item === "Poison") return "the plague walker spreads infection";
            else if (item === "Amulet") return "the cursed corpse shambles onward";
            else return "this corpse shambles onward";
        } else if (monster === "Mummy") {
            if (item === "Staff") return "the pharaoh commands divinely";
            else if (item === "Sword") return "the desert warrior stands eternal";
            else return "this guardian endures eternally";
        } else if (monster === "Succubus") {
            return "the temptress ensnares souls";
        } else if (monster === "Frankenstein") {
            return "this creation defies nature";
        } else { // Goblin
            return "the goblin plots mischief";
        }
    }
    
    function getCurseDescription(effect) {
        if (effect === "Burning") return "while flames consume endlessly.";
        else if (effect === "Blizzard") return "as frozen winds tear reality.";
        else if (effect === "Lightning") return "beneath electric fury.";
        else if (effect === "Meteor") return "while heavens rain destruction.";
        else if (effect === "Mind Blast") return "its screams shatter sanity.";
        else if (effect === "Brain Wash") return "enslaving minds with madness.";
        else if (effect === "Confusion") return "spreading fractured chaos.";
        else if (effect === "Seizure") return "causing reality to convulse.";
        else if (effect === "Poisoning") return "leaving toxic death behind.";
        else if (effect === "Bats") return "commanding nightborn servants.";
        else if (effect === "Blackout") return "plunging worlds into eternal darkness.";
        else if (effect === "Matrix") return "corrupting reality's code.";
        else return "with ancient curses.";
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

    // Track stats
    let mythicCount = 0;
    let legendaryCount = 0;
    let synergyCount = 0;

    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        const { species, background, item, effect } = decodeTokenIdLCG(tokenId);
        
        const monsterName = monsterNames[species];
        const itemName = itemNames[item];
        const backgroundName = backgroundNames[background];
        const displayEffect = getDisplayEffect(species, item, background, effect);
        const effectName = displayEffect.name;
        
        
        // Check synergies - for items with synergy forms, check the transformed version
        let synergy;
        let transformedItemName = itemName;
        
        if (itemName === "Amulet") {
            // For Amulet, check if there's a synergy with "Head"
            transformedItemName = "Head";
            synergy = checkSynergies(monsterName, transformedItemName, backgroundName, effectName);
            if (!synergy.found) {
                // If no synergy with Head, reset to original
                transformedItemName = itemName;
                synergy = checkSynergies(monsterName, itemName, backgroundName, effectName);
            }
        } else if (itemName === "Shoulder") {
            // For Shoulder, check if there's a synergy with "Arm"
            transformedItemName = "Arm";
            synergy = checkSynergies(monsterName, transformedItemName, backgroundName, effectName);
            if (!synergy.found) {
                // If no synergy with Arm, reset to original
                transformedItemName = itemName;
                synergy = checkSynergies(monsterName, itemName, backgroundName, effectName);
            }
        } else {
            // For other items, check normally
            synergy = checkSynergies(monsterName, itemName, backgroundName, effectName);
        }
        
        if (synergy.found) synergyCount++;
        
        // Generate name and story
        let name = synergy.found ? synergy.title : generateTitle(monsterName, backgroundName, itemName, tokenId);
        
        // Generate story using narrative description from contract
        let story = synergy.found ? 
            synergy.description || `A legendary ${monsterName} with extraordinary powers.` :
            getNarrativeDescription(monsterName, backgroundName, itemName, effectName);
        
        // Calculate rarity
        const rarity = calculateRarity(tokenId, synergy.type);
        if (rarity === "Mythic") mythicCount++;
        if (rarity === "Legendary") legendaryCount++;
        
        // Equipment name swap for synergies (based on synergyForm in attributes.json)
        // Only transform if a synergy was found with the transformed name
        let displayItemName = itemName;
        if (synergy.found && transformedItemName !== itemName) {
            displayItemName = transformedItemName;
        }
        
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
    const filename = `FINAL-token-mapping-${Date.now()}.csv`;
    fs.writeFileSync(filename, csvContent);
    
    console.log(`\n✅ FINAL CSV generated successfully: ${filename}`);
    console.log(`Total rows: ${csvRows.length} (1 header + 10,000 tokens)`);
    
    // Statistics
    console.log("\n📈 Statistics:");
    console.log(`- Mythic tokens: ${mythicCount}`);
    console.log(`- Legendary tokens: ${legendaryCount}`);
    console.log(`- Tokens with synergies: ${synergyCount}`);
    
    // Show special tokens
    console.log("\n🌟 Special Legendary Tokens:");
    console.log("  Token #1687: Soul Harvester (Skeleton + Scythe + Shadow + Mind Blast)");
    console.log("  Token #2097: Toxic Abomination (Frankenstein + Poison + Venom + Seizure)");
    
    // Show legendary IDs
    console.log("\n🏆 Some Legendary Token IDs:");
    const legendaryIds = [1, 7, 13, 23, 42, 86, 100, 111];
    for (const id of legendaryIds) {
        const row = csvRows[id].split(',');
        console.log(`  Token #${id}: ${row[1]} with ${row[2]} (${row[7]})`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });