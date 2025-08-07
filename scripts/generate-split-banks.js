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
    'head',        // 10
    'arm'          // 11
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
    'Head',
    'Arm'
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

function generateMonsterBanks() {
    console.log('Generating Split Monster Banks...');
    
    // Load all SVGs
    const monsterSVGs = monsterMapping.map((monster, index) => {
        const filePath = path.join(__dirname, '../assets/monsters', `${monster}.svg`);
        const svg = readSVG(filePath);
        console.log(`  ✓ Loaded ${monster}.svg (${svg.length} chars)`);
        return svg;
    });
    
    // Split into two contracts (0-4 and 5-9)
    const firstContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveMonsterBank1 {
    function getMonsterSVG(uint8 monsterId) public pure returns (string memory) {
        if (monsterId == 0) return '${monsterSVGs[0]}';
        if (monsterId == 1) return '${monsterSVGs[1]}';
        if (monsterId == 2) return '${monsterSVGs[2]}';
        if (monsterId == 3) return '${monsterSVGs[3]}';
        if (monsterId == 4) return '${monsterSVGs[4]}';
        revert("Monster ID not in this bank");
    }
    
    function getMonsterName(uint8 monsterId) public pure returns (string memory) {
        if (monsterId == 0) return "${monsterNames[0]}";
        if (monsterId == 1) return "${monsterNames[1]}";
        if (monsterId == 2) return "${monsterNames[2]}";
        if (monsterId == 3) return "${monsterNames[3]}";
        if (monsterId == 4) return "${monsterNames[4]}";
        revert("Monster ID not in this bank");
    }
}`;
    
    const secondContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveMonsterBank2 {
    function getMonsterSVG(uint8 monsterId) public pure returns (string memory) {
        if (monsterId == 5) return '${monsterSVGs[5]}';
        if (monsterId == 6) return '${monsterSVGs[6]}';
        if (monsterId == 7) return '${monsterSVGs[7]}';
        if (monsterId == 8) return '${monsterSVGs[8]}';
        if (monsterId == 9) return '${monsterSVGs[9]}';
        revert("Monster ID not in this bank");
    }
    
    function getMonsterName(uint8 monsterId) public pure returns (string memory) {
        if (monsterId == 5) return "${monsterNames[5]}";
        if (monsterId == 6) return "${monsterNames[6]}";
        if (monsterId == 7) return "${monsterNames[7]}";
        if (monsterId == 8) return "${monsterNames[8]}";
        if (monsterId == 9) return "${monsterNames[9]}";
        revert("Monster ID not in this bank");
    }
}`;

    // Main bank that delegates to sub-banks
    const mainContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMonsterBank {
    function getMonsterSVG(uint8 monsterId) external pure returns (string memory);
    function getMonsterName(uint8 monsterId) external pure returns (string memory);
}

contract ArweaveMonsterBankV3 {
    IMonsterBank public bank1;
    IMonsterBank public bank2;
    
    constructor(address _bank1, address _bank2) {
        bank1 = IMonsterBank(_bank1);
        bank2 = IMonsterBank(_bank2);
    }
    
    function getMonsterSVG(uint8 monsterId) public view returns (string memory) {
        if (monsterId < 5) {
            return bank1.getMonsterSVG(monsterId);
        } else if (monsterId < 10) {
            return bank2.getMonsterSVG(monsterId);
        }
        revert("Invalid monster ID");
    }
    
    function getMonsterName(uint8 monsterId) public view returns (string memory) {
        if (monsterId < 5) {
            return bank1.getMonsterName(monsterId);
        } else if (monsterId < 10) {
            return bank2.getMonsterName(monsterId);
        }
        revert("Invalid monster ID");
    }
}`;
    
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveMonsterBank1.sol'), firstContract);
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveMonsterBank2.sol'), secondContract);
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveMonsterBankV3.sol'), mainContract);
    
    console.log('✅ Split Monster Banks generated!');
}

function generateItemBanks() {
    console.log('\nGenerating Split Item Banks...');
    
    // Load all SVGs
    const itemSVGs = itemMapping.map((item, index) => {
        const filePath = path.join(__dirname, '../assets/items', `${item}.svg`);
        const svg = readSVG(filePath);
        console.log(`  ✓ Loaded ${item}.svg (${svg.length} chars)`);
        return svg;
    });
    
    // Split into two contracts (0-5 and 6-11)
    const firstContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveItemBank1 {
    function getItemSVG(uint8 itemId) public pure returns (string memory) {
        if (itemId == 0) return '${itemSVGs[0]}';
        if (itemId == 1) return '${itemSVGs[1]}';
        if (itemId == 2) return '${itemSVGs[2]}';
        if (itemId == 3) return '${itemSVGs[3]}';
        if (itemId == 4) return '${itemSVGs[4]}';
        if (itemId == 5) return '${itemSVGs[5]}';
        revert("Item ID not in this bank");
    }
    
    function getItemName(uint8 itemId) public pure returns (string memory) {
        if (itemId == 0) return "${itemNames[0]}";
        if (itemId == 1) return "${itemNames[1]}";
        if (itemId == 2) return "${itemNames[2]}";
        if (itemId == 3) return "${itemNames[3]}";
        if (itemId == 4) return "${itemNames[4]}";
        if (itemId == 5) return "${itemNames[5]}";
        revert("Item ID not in this bank");
    }
}`;
    
    const secondContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveItemBank2 {
    function getItemSVG(uint8 itemId) public pure returns (string memory) {
        if (itemId == 6) return '${itemSVGs[6]}';
        if (itemId == 7) return '${itemSVGs[7]}';
        if (itemId == 8) return '${itemSVGs[8]}';
        if (itemId == 9) return '${itemSVGs[9]}';
        if (itemId == 10) return '${itemSVGs[10]}';
        if (itemId == 11) return '${itemSVGs[11]}';
        revert("Item ID not in this bank");
    }
    
    function getItemName(uint8 itemId) public pure returns (string memory) {
        if (itemId == 6) return "${itemNames[6]}";
        if (itemId == 7) return "${itemNames[7]}";
        if (itemId == 8) return "${itemNames[8]}";
        if (itemId == 9) return "${itemNames[9]}";
        if (itemId == 10) return "${itemNames[10]}";
        if (itemId == 11) return "${itemNames[11]}";
        revert("Item ID not in this bank");
    }
}`;

    // Main bank that delegates to sub-banks
    const mainContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IItemBank {
    function getItemSVG(uint8 itemId) external pure returns (string memory);
    function getItemName(uint8 itemId) external pure returns (string memory);
}

contract ArweaveItemBankV3 {
    IItemBank public bank1;
    IItemBank public bank2;
    
    constructor(address _bank1, address _bank2) {
        bank1 = IItemBank(_bank1);
        bank2 = IItemBank(_bank2);
    }
    
    function getItemSVG(uint8 itemId) public view returns (string memory) {
        if (itemId < 5) {
            return bank1.getItemSVG(itemId);
        } else if (itemId < 10) {
            return bank2.getItemSVG(itemId);
        }
        revert("Invalid item ID");
    }
    
    function getItemName(uint8 itemId) public view returns (string memory) {
        if (itemId < 5) {
            return bank1.getItemName(itemId);
        } else if (itemId < 10) {
            return bank2.getItemName(itemId);
        }
        revert("Invalid item ID");
    }
}`;
    
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveItemBank1.sol'), firstContract);
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveItemBank2.sol'), secondContract);
    fs.writeFileSync(path.join(__dirname, '../contracts/ArweaveItemBankV3.sol'), mainContract);
    
    console.log('✅ Split Item Banks generated!');
}

// Generate all contracts
generateMonsterBanks();
generateItemBanks();

console.log('\n✨ Split bank contracts generated successfully!');
console.log('Next steps:');
console.log('1. Run: npx hardhat compile');
console.log('2. Deploy with deploy-split-banks.js');