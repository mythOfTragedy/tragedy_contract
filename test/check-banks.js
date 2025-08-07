const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Checking Bank Contract Mappings...\n");

    const deploymentData = require('../viewer/deployment.json');
    
    // Get bank contracts
    const monsterBank = await ethers.getContractAt("ArweaveMonsterBank", deploymentData.contracts.monsterBank);
    const itemBank = await ethers.getContractAt("ArweaveItemBank", deploymentData.contracts.itemBank);
    const backgroundBank = await ethers.getContractAt("ArweaveBackgroundBank", deploymentData.contracts.backgroundBank);
    const effectBank = await ethers.getContractAt("ArweaveEffectBank", deploymentData.contracts.effectBank);
    
    console.log("📍 Bank Contracts:");
    console.log("  Monster Bank:", deploymentData.contracts.monsterBank);
    console.log("  Item Bank:", deploymentData.contracts.itemBank);
    console.log("  Background Bank:", deploymentData.contracts.backgroundBank);
    console.log("  Effect Bank:", deploymentData.contracts.effectBank);
    console.log("");

    // Check monster names
    console.log("🦹 Monster Names (0-9):");
    for (let i = 0; i < 10; i++) {
        const name = await monsterBank.getMonsterName(i);
        console.log(`  ${i}: ${name}`);
    }
    console.log("");

    // Check item names
    console.log("🗡️ Item Names (0-9):");
    for (let i = 0; i < 10; i++) {
        const name = await itemBank.getItemName(i);
        console.log(`  ${i}: ${name}`);
    }
    console.log("");

    // Check background names
    console.log("🌍 Background Names (0-9):");
    for (let i = 0; i < 10; i++) {
        const name = await backgroundBank.getBackgroundName(i);
        console.log(`  ${i}: ${name}`);
    }
    console.log("");

    // Check effect names
    console.log("✨ Effect Names (0-9):");
    for (let i = 0; i < 10; i++) {
        const name = await effectBank.getEffectName(i);
        console.log(`  ${i}: ${name}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });