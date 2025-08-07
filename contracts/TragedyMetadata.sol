// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Base64.sol";
import "./libraries/NarrativeGenerator.sol";
import "./ArweaveTragedyComposer.sol";

interface IArweaveTragedyComposer {
    function composeSVG(uint8 species, uint8 background, uint8 item, uint8 effect) external view returns (string memory);
    function filterParams(uint8) external view returns (uint16, uint16, uint16);
    function monsterBank() external view returns (address);
    function itemBank() external view returns (address);
    function backgroundBank() external view returns (address);
    function effectBank() external view returns (address);
}

/**
 * @title TragedyMetadataV5
 * @notice Implements proper attribute names and adds Curse+Realm synergies
 */
contract TragedyMetadata {
    IArweaveTragedyComposer public composer;
    
    struct SynergyResult {
        bool found;
        string title;
        string description;
        uint8 synergyType; // 0=none, 1=dual, 2=trinity, 3=quad
    }
    
    constructor(address _composer) {
        composer = IArweaveTragedyComposer(_composer);
    }
    
    function decodeTokenId(uint256 tokenId) public pure returns (uint8 species, uint8 background, uint8 item, uint8 effect) {
        uint256 seed = uint256(keccak256(abi.encodePacked(tokenId)));
        species = uint8(seed % 10);
        background = uint8((seed >> 8) % 10);
        item = uint8((seed >> 16) % 10);
        effect = uint8((seed >> 24) % 10);
    }
    
    // IMetadataBank interface implementation
    function getMetadata(uint256 index) external view returns (string memory) {
        uint256 tokenId = index + 1;
        (uint8 species, uint8 background, uint8 item, uint8 effect) = decodeTokenId(tokenId);
        return generateMetadata(tokenId, species, background, item, effect);
    }
    
    function getMetadataCount() external pure returns (uint256) {
        return 10000;
    }
    
    function generateMetadata(
        uint256 tokenId,
        uint8 species,
        uint8 background,
        uint8 item,
        uint8 effect
    ) public view returns (string memory) {
        // Get SVG from composer
        string memory svg = composer.composeSVG(species, background, item, effect);
        
        // Get names from banks
        string memory monsterName = IArweaveMonsterBank(address(composer.monsterBank())).getMonsterName(species);
        string memory backgroundName = IArweaveBackgroundBank(address(composer.backgroundBank())).getBackgroundName(background);
        string memory itemName = IArweaveItemBank(address(composer.itemBank())).getItemName(item);
        string memory effectName = IArweaveEffectBank(address(composer.effectBank())).getEffectName(effect);
        
        // Check for synergies
        SynergyResult memory synergy = checkSynergies(monsterName, backgroundName, itemName, effectName);
        
        // Get title and description
        string memory title;
        string memory description;
        string memory displayItemName = itemName;
        
        if (synergy.found) {
            title = synergy.title;
            description = synergy.description;
            
            // Swap item names during synergy
            if (item == 9) { // Amulet -> Head
                displayItemName = "Head";
            } else if (item == 8) { // Shoulder -> Arm
                displayItemName = "Arm";
            }
        } else {
            // Generate narrative title and description
            title = NarrativeGenerator.generateTitle(monsterName, backgroundName, itemName, tokenId);
            description = getNarrativeDescription(monsterName, backgroundName, itemName, effectName);
        }
        
        
        // Build metadata JSON with proper attribute names
        string memory json = string(abi.encodePacked(
            '{"name":"', title, '",',
            '"description":"', description, '",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":['
        ));
        
        // Use Species, Equipment, Realm, Curse as trait types
        json = string(abi.encodePacked(
            json,
            '{"trait_type":"Species","value":"', monsterName, '"},',
            '{"trait_type":"Equipment","value":"', displayItemName, '"},',
            '{"trait_type":"Realm","value":"', backgroundName, '"},',
            '{"trait_type":"Curse","value":"', effectName, '"}'
        ));
        
        // Calculate rarity
        string memory rarity = calculateRarity(species, item, background, effect, tokenId, synergy.synergyType);
        
        // Add synergy attribute if found
        if (synergy.found) {
            json = string(abi.encodePacked(
                json,
                ',{"trait_type":"Synergy","value":"', synergy.title, '"}'
            ));
        }
        
        // Add rarity attribute
        json = string(abi.encodePacked(
            json,
            ',{"trait_type":"Rarity","value":"', rarity, '"}'
        ));
        
        
        json = string(abi.encodePacked(json, ']}'));
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(json))
        ));
    }
    
    function checkSynergies(
        string memory monster,
        string memory background,
        string memory item,
        string memory effect
    ) internal pure returns (SynergyResult memory) {
        // Check Quad Synergies (only most important ones)
        if (keccak256(bytes(monster)) == keccak256(bytes("Dragon")) &&
            keccak256(bytes(item)) == keccak256(bytes("Crown")) &&
            keccak256(bytes(background)) == keccak256(bytes("Ragnarok")) &&
            keccak256(bytes(effect)) == keccak256(bytes("Meteor"))) {
            return SynergyResult(true, "Cosmic Sovereign", "The cosmic ruler who brings the end times. Its crown channels meteor storms that herald the final days.", 3);
        }
        
        if (keccak256(bytes(monster)) == keccak256(bytes("Vampire")) &&
            keccak256(bytes(item)) == keccak256(bytes("Wine")) &&
            keccak256(bytes(background)) == keccak256(bytes("Bloodmoon")) &&
            keccak256(bytes(effect)) == keccak256(bytes("Bats"))) {
            return SynergyResult(true, "Crimson Lord", "Under the blood moon, the crimson ruler commands legions of bats. The ancient vampire lord in its truest form.", 3);
        }
        
        // Check important Dual Synergies (Equipment transformation synergies)
        if (keccak256(bytes(monster)) == keccak256(bytes("Werewolf")) &&
            keccak256(bytes(item)) == keccak256(bytes("Amulet"))) {
            return SynergyResult(true, "The Alpha's Trophy", "What appears to be a simple amulet is revealed as the severed head of the previous pack leader.", 1);
        }
        
        if (keccak256(bytes(monster)) == keccak256(bytes("Frankenstein")) &&
            keccak256(bytes(item)) == keccak256(bytes("Shoulder"))) {
            return SynergyResult(true, "The Collector", "The shoulder armor is actually a collection of harvested arms, still twitching with unnatural life.", 1);
        }
        
        // Check Curse + Realm Synergies
        if (keccak256(bytes(effect)) == keccak256(bytes("Burning")) && 
            keccak256(bytes(background)) == keccak256(bytes("Inferno"))) {
            return SynergyResult(true, "Eternal Flame", "Fire that burns without fuel, consuming reality itself.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Blizzard")) && 
            keccak256(bytes(background)) == keccak256(bytes("Frost"))) {
            return SynergyResult(true, "Absolute Zero", "Where ice meets storm, nothing survives.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Poisoning")) && 
            keccak256(bytes(background)) == keccak256(bytes("Venom"))) {
            return SynergyResult(true, "Toxic Miasma", "A poisonous fog that corrupts all it touches.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Mindblast")) && 
            keccak256(bytes(background)) == keccak256(bytes("Void"))) {
            return SynergyResult(true, "Mental Collapse", "The void between thoughts where sanity dies.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Lightning")) && 
            keccak256(bytes(background)) == keccak256(bytes("Bloodmoon"))) {
            return SynergyResult(true, "Crimson Thunder", "Blood-red lightning that strikes with divine wrath.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Brainwash")) && 
            keccak256(bytes(background)) == keccak256(bytes("Corruption"))) {
            return SynergyResult(true, "Mind Corruption", "Thoughts twisted into weapons against their owner.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Meteor")) && 
            keccak256(bytes(background)) == keccak256(bytes("Ragnarok"))) {
            return SynergyResult(true, "Apocalypse Rain", "The sky falls, bringing the end of all things.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Bats")) && 
            keccak256(bytes(background)) == keccak256(bytes("Shadow"))) {
            return SynergyResult(true, "Night Terror", "Living shadows that feast on fear.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Confusion")) && 
            keccak256(bytes(background)) == keccak256(bytes("Decay"))) {
            return SynergyResult(true, "Madness Plague", "A disease that rots both mind and body.", 1);
        }
        
        if (keccak256(bytes(effect)) == keccak256(bytes("Seizure")) && 
            keccak256(bytes(background)) == keccak256(bytes("Abyss"))) {
            return SynergyResult(true, "Deep Tremor", "Convulsions from staring too long into the infinite dark.", 1);
        }
        
        // Check important Dual Synergies (Species + Equipment)
        if (keccak256(bytes(monster)) == keccak256(bytes("Vampire")) &&
            keccak256(bytes(item)) == keccak256(bytes("Wine"))) {
            return SynergyResult(true, "Blood Sommelier", "A refined predator who has transcended mere survival. This vampire has cultivated an exquisite palate for the finest vintages.", 1);
        }
        
        if (keccak256(bytes(monster)) == keccak256(bytes("Skeleton")) &&
            keccak256(bytes(item)) == keccak256(bytes("Scythe"))) {
            return SynergyResult(true, "Death's Herald", "The original harbinger of doom. This skeletal reaper has collected souls since the dawn of mortality itself.", 1);
        }
        
        return SynergyResult(false, "", "", 0);
    }
    
    function getNarrativeDescription(
        string memory monster,
        string memory background,
        string memory item,
        string memory effect
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(
            getRealmPrefix(background), " ",
            getMonsterAction(monster, item), " ",
            getCurseDescription(effect)
        ));
    }
    
    function getRealmPrefix(string memory background) internal pure returns (string memory) {
        bytes32 bgHash = keccak256(bytes(background));
        
        if (bgHash == keccak256(bytes("Bloodmoon"))) return "Under the crimson gaze,";
        else if (bgHash == keccak256(bytes("Abyss"))) return "From the endless void,";
        else if (bgHash == keccak256(bytes("Decay"))) return "In rotting wastelands,";
        else if (bgHash == keccak256(bytes("Corruption"))) return "Where reality breaks,";
        else if (bgHash == keccak256(bytes("Venom"))) return "In toxic mists,";
        else if (bgHash == keccak256(bytes("Void"))) return "At existence's edge,";
        else if (bgHash == keccak256(bytes("Inferno"))) return "Within eternal flames,";
        else if (bgHash == keccak256(bytes("Frost"))) return "In frozen wastes,";
        else if (bgHash == keccak256(bytes("Ragnarok"))) return "As the world ends,";
        else return "In shadow's reach,";
    }
    
    function getMonsterAction(string memory monster, string memory item) internal pure returns (string memory) {
        bytes32 monsterHash = keccak256(bytes(monster));
        bytes32 itemHash = keccak256(bytes(item));
        
        if (monsterHash == keccak256(bytes("Dragon"))) {
            if (itemHash == keccak256(bytes("Crown"))) return "the wyrm reclaims dominion";
            else if (itemHash == keccak256(bytes("Sword"))) return "the drake wields dragonfire steel";
            else return "this terror hoards cursed treasures";
        } else if (monsterHash == keccak256(bytes("Vampire"))) {
            if (itemHash == keccak256(bytes("Wine"))) return "the noble savors crimson vintage";
            else return "this nightwalker hunts eternally";
        } else if (monsterHash == keccak256(bytes("Skeleton"))) {
            if (itemHash == keccak256(bytes("Scythe"))) return "death's herald reaps souls";
            else return "ancient bones clutch their relics";
        } else if (monsterHash == keccak256(bytes("Demon"))) {
            if (itemHash == keccak256(bytes("Torch"))) return "the hellspawn lights perdition's path";
            else return "this fiend wields torment";
        } else if (monsterHash == keccak256(bytes("Werewolf"))) {
            return "the beast stalks with primal fury";
        } else if (monsterHash == keccak256(bytes("Zombie"))) {
            if (itemHash == keccak256(bytes("Poison"))) return "the plague walker spreads infection";
            else return "this corpse shambles onward";
        } else if (monsterHash == keccak256(bytes("Mummy"))) {
            if (itemHash == keccak256(bytes("Staff"))) return "the pharaoh commands divinely";
            else return "this guardian endures eternally";
        } else if (monsterHash == keccak256(bytes("Succubus"))) {
            return "the temptress ensnares souls";
        } else if (monsterHash == keccak256(bytes("Frankenstein"))) {
            return "this creation defies nature";
        } else {
            return "the goblin plots mischief";
        }
    }
    
    function getCurseDescription(string memory effect) internal pure returns (string memory) {
        bytes32 effectHash = keccak256(bytes(effect));
        
        if (effectHash == keccak256(bytes("Burning"))) return "while flames consume endlessly.";
        else if (effectHash == keccak256(bytes("Blizzard"))) return "as frozen winds tear reality.";
        else if (effectHash == keccak256(bytes("Lightning"))) return "beneath electric fury.";
        else if (effectHash == keccak256(bytes("Meteor"))) return "while heavens rain destruction.";
        else if (effectHash == keccak256(bytes("Mindblast"))) return "its screams shatter sanity.";
        else if (effectHash == keccak256(bytes("Brainwash"))) return "enslaving minds with madness.";
        else if (effectHash == keccak256(bytes("Confusion"))) return "spreading fractured chaos.";
        else if (effectHash == keccak256(bytes("Seizure"))) return "causing reality to convulse.";
        else if (effectHash == keccak256(bytes("Poisoning"))) return "leaving toxic death behind.";
        else return "commanding nightborn servants.";
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function calculateRarity(
        uint8 species,
        uint8 item,
        uint8 background,
        uint8 effect,
        uint256 tokenId,
        uint8 synergyType
    ) internal pure returns (string memory) {
        // Check if it's a Legendary ID
        if (isLegendaryId(tokenId)) {
            return "Legendary";
        }
        
        // Quad synergy always gets Mythic
        if (synergyType == 3) {
            return "Mythic";
        }
        
        // Trinity synergy gets at least Epic
        if (synergyType == 2) {
            return "Epic";
        }
        
        // Calculate base rarity level
        uint8 baseLevel = getBaseRarityLevel(tokenId);
        
        // Dual synergy upgrades by 1 level
        if (synergyType == 1) {
            baseLevel = baseLevel + 1;
            if (baseLevel > 4) baseLevel = 4; // Cap at Legendary
        }
        
        return getRarityName(baseLevel);
    }
    
    function isLegendaryId(uint256 tokenId) internal pure returns (bool) {
        // 30 Legendary IDs from DESIGN.md
        return tokenId == 1 || tokenId == 7 || tokenId == 13 || tokenId == 23 || 
               tokenId == 42 || tokenId == 86 || tokenId == 100 || tokenId == 111 || 
               tokenId == 187 || tokenId == 217 || tokenId == 333 || tokenId == 404 || 
               tokenId == 555 || tokenId == 616 || tokenId == 666 || tokenId == 777 || 
               tokenId == 911 || tokenId == 999 || tokenId == 1000 || tokenId == 1111 || 
               tokenId == 1337 || tokenId == 1347 || tokenId == 1408 || tokenId == 1492 || 
               tokenId == 1692 || tokenId == 1776 || tokenId == 2187 || tokenId == 3141 || 
               tokenId == 4077 || tokenId == 5150 || tokenId == 6174 || tokenId == 7777 || 
               tokenId == 8128 || tokenId == 9999;
    }
    
    function getBaseRarityLevel(uint256 tokenId) internal pure returns (uint8) {
        uint256 seed = uint256(keccak256(abi.encodePacked(tokenId)));
        uint256 roll = seed % 100;
        
        if (roll < 40) return 0; // Common 40%
        if (roll < 70) return 1; // Uncommon 30%
        if (roll < 85) return 2; // Rare 15%
        if (roll < 95) return 3; // Epic 10%
        return 4; // Legendary 5%
    }
    
    function getRarityName(uint8 level) internal pure returns (string memory) {
        if (level == 0) return "Common";
        if (level == 1) return "Uncommon";
        if (level == 2) return "Rare";
        if (level == 3) return "Epic";
        if (level == 4) return "Legendary";
        return "Mythic";
    }
}