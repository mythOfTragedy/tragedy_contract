const hre = require("hardhat");
const config = require("./config");

// Color codes
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

function log(message, type = 'info') {
    const prefix = {
        info: `${colors.cyan}ℹ${colors.reset}`,
        success: `${colors.green}✓${colors.reset}`,
        warning: `${colors.yellow}⚠${colors.reset}`,
        error: `${colors.red}✗${colors.reset}`,
        test: `${colors.bright}🧪${colors.reset}`
    };
    console.log(`${prefix[type] || prefix.info} ${message}`);
}

async function verifyDeployment(deployment) {
    console.log("\n" + "=".repeat(60));
    console.log(`${colors.bright}Deployment Verification${colors.reset}`);
    console.log("=".repeat(60) + "\n");
    
    let allPassed = true;
    const results = [];
    
    try {
        // 1. Verify contract connections
        log("Verifying contract connections...", 'test');
        
        const nft = await hre.ethers.getContractAt("BankedNFT", deployment.contracts.bankedNFT);
        const metadataAddress = await nft.metadataBank();
        
        if (metadataAddress === deployment.contracts.metadata) {
            log("NFT → Metadata connection", 'success');
            results.push({ test: "NFT-Metadata Link", passed: true });
        } else {
            log("NFT → Metadata connection FAILED", 'error');
            results.push({ test: "NFT-Metadata Link", passed: false });
            allPassed = false;
        }
        
        // 2. Test metadata generation
        log("\nTesting metadata generation...", 'test');
        
        const metadata = await hre.ethers.getContractAt("TragedyMetadata", deployment.contracts.metadata);
        const testTokens = config.testing.testTokenIds;
        
        for (const tokenId of testTokens) {
            try {
                const attr = await metadata.getAttributes(tokenId);
                log(`Token #${tokenId}: Species=${attr.species}, Item=${attr.item}, BG=${attr.background}, Effect=${attr.effect}`, 'success');
                results.push({ test: `Token #${tokenId} metadata`, passed: true });
            } catch (error) {
                log(`Token #${tokenId} metadata generation FAILED: ${error.message}`, 'error');
                results.push({ test: `Token #${tokenId} metadata`, passed: false });
                allPassed = false;
            }
        }
        
        // 3. Verify legendary tokens
        if (config.testing.validateLegendaries) {
            log("\nVerifying legendary tokens...", 'test');
            
            const seedConfig = config.getSeedConfig();
            const legendaries = [
                { id: seedConfig.legendaryTokens.soulHarvester, name: "Soul Harvester", expected: { species: 9, item: 6, background: 9, effect: 3 } },
                { id: seedConfig.legendaryTokens.toxicAbomination, name: "Toxic Abomination", expected: { species: 2, item: 3, background: 4, effect: 3 } }
            ];
            
            for (const legendary of legendaries) {
                const attr = await metadata.getAttributes(legendary.id);
                const matches = 
                    attr.species === legendary.expected.species &&
                    attr.item === legendary.expected.item &&
                    attr.background === legendary.expected.background &&
                    attr.effect === legendary.expected.effect;
                
                if (matches) {
                    log(`${legendary.name} (#${legendary.id}) attributes correct`, 'success');
                    results.push({ test: `${legendary.name} attributes`, passed: true });
                } else {
                    log(`${legendary.name} (#${legendary.id}) attributes INCORRECT`, 'error');
                    log(`  Expected: S=${legendary.expected.species}, I=${legendary.expected.item}, B=${legendary.expected.background}, E=${legendary.expected.effect}`, 'error');
                    log(`  Actual: S=${attr.species}, I=${attr.item}, B=${attr.background}, E=${attr.effect}`, 'error');
                    results.push({ test: `${legendary.name} attributes`, passed: false });
                    allPassed = false;
                }
            }
        }
        
        // 4. Test bank functionality
        log("\nTesting bank functionality...", 'test');
        
        const composer = await hre.ethers.getContractAt("ArweaveTragedyComposer", deployment.contracts.composer);
        
        try {
            // Test a simple composition
            const svg = await composer.composeSVG(0, 0, 0, 0);
            const svgLength = svg.length;
            
            if (svgLength > 1000) { // Basic check that SVG was generated
                log(`SVG composition successful (${svgLength} chars)`, 'success');
                results.push({ test: "SVG Composition", passed: true });
            } else {
                log("SVG composition failed - output too small", 'error');
                results.push({ test: "SVG Composition", passed: false });
                allPassed = false;
            }
        } catch (error) {
            log(`SVG composition FAILED: ${error.message}`, 'error');
            results.push({ test: "SVG Composition", passed: false });
            allPassed = false;
        }
        
        // 5. Check contract sizes (warning only)
        log("\nChecking contract sizes...", 'test');
        
        const contracts = ['BankedNFT', 'TragedyMetadata', 'ArweaveTragedyComposer'];
        for (const contractName of contracts) {
            try {
                const artifact = await hre.artifacts.readArtifact(contractName);
                const bytecodeSize = artifact.deployedBytecode.length / 2 - 1;
                const sizeKB = (bytecodeSize / 1024).toFixed(2);
                const maxSize = 24576; // 24KB limit
                
                if (bytecodeSize < maxSize) {
                    log(`${contractName}: ${sizeKB}KB (${((bytecodeSize/maxSize)*100).toFixed(1)}% of limit)`, 'success');
                } else {
                    log(`${contractName}: ${sizeKB}KB - EXCEEDS LIMIT!`, 'warning');
                }
            } catch (error) {
                log(`Could not check ${contractName} size`, 'warning');
            }
        }
        
    } catch (error) {
        log(`Verification error: ${error.message}`, 'error');
        allPassed = false;
    }
    
    // Summary
    console.log("\n" + "-".repeat(60));
    console.log(`${colors.bright}Verification Summary${colors.reset}`);
    console.log("-".repeat(60));
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`Total tests: ${results.length}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    if (failed > 0) {
        console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    }
    
    if (allPassed) {
        console.log(`\n${colors.green}${colors.bright}✨ All verifications passed!${colors.reset}`);
    } else {
        console.log(`\n${colors.red}${colors.bright}❌ Some verifications failed${colors.reset}`);
        console.log("\nFailed tests:");
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.test}`);
        });
    }
    
    return allPassed;
}

// Standalone execution
async function main() {
    const fs = require('fs');
    const path = require('path');
    
    // Load the most recent deployment
    const currentPath = path.join(__dirname, '../../deployments/current.json');
    
    if (!fs.existsSync(currentPath)) {
        log("No current deployment found. Run deployment first.", 'error');
        process.exit(1);
    }
    
    const deployment = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    const passed = await verifyDeployment(deployment);
    
    process.exit(passed ? 0 : 1);
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = { verifyDeployment };