const fs = require('fs');
const path = require('path');

// Monster mapping (0-9)
const monsterMapping = [
    'werewolf',    // 0
    'goblin',      // 1
    'frankenstein',// 2
    'demon',       // 3
    'dragon',      // 4
    'zombie',      // 5
    'vampire',     // 6
    'mummy',       // 7
    'succubus',    // 8
    'skeleton'     // 9
];

// Item mapping (0-11)
const itemMapping = [
    'crown',       // 0
    'sword',       // 1
    'shield',      // 2
    'poison',      // 3
    'torch',       // 4
    'wine',        // 5
    'scythe',      // 6
    'staff',       // 7
    'shoulder',    // 8
    'amulet',      // 9
    'head',        // 10 - hidden item
    'arm'          // 11 - hidden item
];

// Monster names for the contract
const monsterNames = [
    'Werewolf',
    'Goblin',
    'Frankenstein',
    'Demon',
    'Dragon',
    'Zombie',
    'Vampire',
    'Mummy',
    'Succubus',
    'Skeleton'
];

// Item names for the contract
const itemNames = [
    'Crown',
    'Sword',
    'Shield',
    'Poison',
    'Torch',
    'Wine',
    'Scythe',
    'Staff',
    'Shoulder',
    'Amulet',
    'Head',        // 10 - hidden item
    'Arm'          // 11 - hidden item
];

function readSVG(filePath) {
    const svg = fs.readFileSync(filePath, 'utf8');
    // Clean up the SVG - remove unnecessary whitespace, newlines, and comments
    return svg
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/'/g, "\\'") // Escape single quotes
        .trim();
}

function generateMonsterBank() {
    console.log('Generating ArweaveMonsterBank with real SVGs...');
    
    const monsterSVGs = monsterMapping.map((monster, index) => {
        const filePath = path.join(__dirname, '../assets/monsters', `${monster}.svg`);
        const svg = readSVG(filePath);
        console.log(`  ✓ Loaded ${monster}.svg (${svg.length} chars)`);
        return svg;
    });
    
    const contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveMonsterBank {
    function getMonsterSVG(uint8 monsterId) public pure returns (string memory) {
        if (monsterId == 0) return '${monsterSVGs[0]}';
        if (monsterId == 1) return '${monsterSVGs[1]}';
        if (monsterId == 2) return '${monsterSVGs[2]}';
        if (monsterId == 3) return '${monsterSVGs[3]}';
        if (monsterId == 4) return '${monsterSVGs[4]}';
        if (monsterId == 5) return '${monsterSVGs[5]}';
        if (monsterId == 6) return '${monsterSVGs[6]}';
        if (monsterId == 7) return '${monsterSVGs[7]}';
        if (monsterId == 8) return '${monsterSVGs[8]}';
        if (monsterId == 9) return '${monsterSVGs[9]}';
        revert("Invalid monster ID");
    }
    
    function getMonsterName(uint8 monsterId) public pure returns (string memory) {
        string[10] memory names = [
            "${monsterNames[0]}",
            "${monsterNames[1]}",
            "${monsterNames[2]}",
            "${monsterNames[3]}",
            "${monsterNames[4]}",
            "${monsterNames[5]}",
            "${monsterNames[6]}",
            "${monsterNames[7]}",
            "${monsterNames[8]}",
            "${monsterNames[9]}"
        ];
        
        require(monsterId < 10, "Invalid monster ID");
        return names[monsterId];
    }
}`;
    
    fs.writeFileSync(
        path.join(__dirname, '../contracts/ArweaveMonsterBankV2.sol'),
        contract
    );
    
    console.log('✅ ArweaveMonsterBankV2.sol generated!');
}

function generateItemBank() {
    console.log('\nGenerating ArweaveItemBank with real SVGs...');
    
    const itemSVGs = itemMapping.map((item, index) => {
        const filePath = path.join(__dirname, '../assets/items', `${item}.svg`);
        const svg = readSVG(filePath);
        console.log(`  ✓ Loaded ${item}.svg (${svg.length} chars)`);
        return svg;
    });
    
    const contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveItemBank {
    function getItemSVG(uint8 itemId) public pure returns (string memory) {
        if (itemId == 0) return '${itemSVGs[0]}';
        if (itemId == 1) return '${itemSVGs[1]}';
        if (itemId == 2) return '${itemSVGs[2]}';
        if (itemId == 3) return '${itemSVGs[3]}';
        if (itemId == 4) return '${itemSVGs[4]}';
        if (itemId == 5) return '${itemSVGs[5]}';
        if (itemId == 6) return '${itemSVGs[6]}';
        if (itemId == 7) return '${itemSVGs[7]}';
        if (itemId == 8) return '${itemSVGs[8]}';
        if (itemId == 9) return '${itemSVGs[9]}';
        if (itemId == 10) return '${itemSVGs[10]}';
        if (itemId == 11) return '${itemSVGs[11]}';
        revert("Invalid item ID");
    }
    
    function getItemName(uint8 itemId) public pure returns (string memory) {
        string[12] memory names = [
            "${itemNames[0]}",
            "${itemNames[1]}",
            "${itemNames[2]}",
            "${itemNames[3]}",
            "${itemNames[4]}",
            "${itemNames[5]}",
            "${itemNames[6]}",
            "${itemNames[7]}",
            "${itemNames[8]}",
            "${itemNames[9]}",
            "${itemNames[10]}",
            "${itemNames[11]}"
        ];
        
        require(itemId < 12, "Invalid item ID");
        return names[itemId];
    }
}`;
    
    fs.writeFileSync(
        path.join(__dirname, '../contracts/ArweaveItemBankV2.sol'),
        contract
    );
    
    console.log('✅ ArweaveItemBankV2.sol generated!');
}

// Generate both contracts
generateMonsterBank();
generateItemBank();

console.log('\n✨ Bank contracts generated successfully!');
console.log('Next steps:');
console.log('1. Run: npx hardhat compile');
console.log('2. Deploy the new banks with deploy-updated-banks.js');