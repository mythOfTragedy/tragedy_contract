const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Testing Legendary Effect Combinations...\n");

    // Get deployed contracts
    const deploymentData = require('../viewer/deployment.json');
    const composer = await ethers.getContractAt("ArweaveTragedyComposer", deploymentData.contracts.composer);
    const effectBank = await ethers.getContractAt("ArweaveEffectBank", deploymentData.contracts.effectBank);

    // Test cases for legendary effect combinations
    const testCases = [
        {
            name: "Soul Harvester (Skeleton + Scythe + Shadow + Mind Blast → Blackout)",
            species: 9,  // Skeleton
            item: 6,     // Scythe
            background: 9, // Shadow
            effect: 1,    // Mind Blast
            expectedEffect: 10, // Should transform to Blackout
            expectedEffectName: "Blackout"
        },
        {
            name: "Toxic Abomination (Frankenstein + Poison + Venom + Seizure → Matrix)",
            species: 2,  // Frankenstein
            item: 3,     // Poison
            background: 4, // Venom
            effect: 0,    // Seizure
            expectedEffect: 11, // Should transform to Matrix
            expectedEffectName: "Matrix"
        },
        {
            name: "Normal combination (should not transform)",
            species: 0,  // Werewolf
            item: 0,     // Crown
            background: 0, // Bloodmoon
            effect: 0,    // Seizure
            expectedEffect: 0, // Should remain Seizure
            expectedEffectName: "Seizure"
        }
    ];

    console.log("📋 Testing getDisplayEffect function...\n");

    for (const test of testCases) {
        console.log(`Testing: ${test.name}`);
        console.log(`Input: Species=${test.species}, Item=${test.item}, Background=${test.background}, Effect=${test.effect}`);
        
        try {
            // Test getDisplayEffect function
            const displayEffect = await composer.getDisplayEffect(
                test.species,
                test.item,
                test.background,
                test.effect
            );
            
            console.log(`Result: Display Effect ID = ${displayEffect}`);
            console.log(`Expected: ${test.expectedEffect}`);
            console.log(`✅ ${displayEffect == test.expectedEffect ? 'PASS' : 'FAIL'}\n`);
            
            // Verify effect name
            if (displayEffect == test.expectedEffect) {
                const effectName = await effectBank.getEffectName(displayEffect);
                console.log(`Effect Name: ${effectName}`);
                console.log(`Expected Name: ${test.expectedEffectName}`);
                console.log(`✅ Name Check: ${effectName === test.expectedEffectName ? 'PASS' : 'FAIL'}\n`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
        }
    }

    console.log("\n📋 Testing full composeSVG with legendary effects...\n");

    // Test Soul Harvester combination
    console.log("Generating Soul Harvester SVG...");
    try {
        const soulHarvesterSVG = await composer.composeSVG(9, 9, 6, 1);
        
        // Check if Blackout effect URL is in the SVG
        const blackoutUrl = await effectBank.getEffectUrl(10);
        const containsBlackout = soulHarvesterSVG.includes(blackoutUrl);
        
        console.log(`✅ Soul Harvester SVG generated`);
        console.log(`Contains Blackout effect: ${containsBlackout ? 'YES' : 'NO'}`);
        console.log(`SVG length: ${soulHarvesterSVG.length} characters\n`);
    } catch (error) {
        console.log(`❌ Error generating Soul Harvester: ${error.message}\n`);
    }

    // Test Toxic Abomination combination
    console.log("Generating Toxic Abomination SVG...");
    try {
        const toxicAbominationSVG = await composer.composeSVG(2, 4, 3, 0);
        
        // Check if Matrix effect URL is in the SVG
        const matrixUrl = await effectBank.getEffectUrl(11);
        const containsMatrix = toxicAbominationSVG.includes(matrixUrl);
        
        console.log(`✅ Toxic Abomination SVG generated`);
        console.log(`Contains Matrix effect: ${containsMatrix ? 'YES' : 'NO'}`);
        console.log(`SVG length: ${toxicAbominationSVG.length} characters\n`);
    } catch (error) {
        console.log(`❌ Error generating Toxic Abomination: ${error.message}\n`);
    }

    console.log("✅ Legendary effect testing complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });