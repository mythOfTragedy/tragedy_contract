const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// Color codes for console output
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
        deploy: `${colors.bright}🚀${colors.reset}`
    };
    console.log(`${prefix[type] || prefix.info} ${message}`);
}

async function deployContract(contractName, ...args) {
    log(`Deploying ${contractName}...`, 'deploy');
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...args);
    await contract.deployed();
    log(`${contractName} deployed to: ${contract.address}`, 'success');
    return contract;
}

async function main() {
    try {
        // Validate configuration
        config.validate();
        
        const network = hre.network.name;
        const networkConfig = config.getNetworkConfig(network);
        
        console.log("\n" + "=".repeat(60));
        console.log(`${colors.bright}Tragedy NFT - Unified Deployment System${colors.reset}`);
        console.log("=".repeat(60));
        
        // Get deployer info
        const [deployer] = await hre.ethers.getSigners();
        log(`Network: ${network} (${networkConfig.description})`);
        log(`Deployer: ${deployer.address}`);
        log(`Balance: ${hre.ethers.utils.formatEther(await deployer.getBalance())} ETH`);
        
        const deployment = {
            network,
            timestamp: new Date().toISOString(),
            contracts: {}
        };
        
        console.log("\n" + "-".repeat(60));
        console.log(`${colors.bright}Starting Deployment${colors.reset}`);
        console.log("-".repeat(60) + "\n");
        
        // Layer 1: Individual Banks
        log("Layer 1: Deploying Individual Banks", 'info');
        
        // Monster Banks
        const monsterBank1 = await deployContract("ArweaveMonsterBank1");
        const monsterBank2 = await deployContract("ArweaveMonsterBank2");
        deployment.contracts.monsterBank1 = monsterBank1.address;
        deployment.contracts.monsterBank2 = monsterBank2.address;
        
        // Item Banks
        const itemBank1 = await deployContract("ArweaveItemBank1");
        const itemBank2 = await deployContract("ArweaveItemBank2");
        deployment.contracts.itemBank1 = itemBank1.address;
        deployment.contracts.itemBank2 = itemBank2.address;
        
        // Layer 1: Main Banks
        log("\nLayer 1: Deploying Main Banks", 'info');
        
        const monsterBank = await deployContract(
            "ArweaveMonsterBank",
            monsterBank1.address,
            monsterBank2.address
        );
        deployment.contracts.monsterBank = monsterBank.address;
        
        const itemBank = await deployContract(
            "ArweaveItemBank", 
            itemBank1.address,
            itemBank2.address
        );
        deployment.contracts.itemBank = itemBank.address;
        
        const backgroundBank = await deployContract("ArweaveBackgroundBank");
        deployment.contracts.backgroundBank = backgroundBank.address;
        
        const effectBank = await deployContract("ArweaveEffectBank");
        deployment.contracts.effectBank = effectBank.address;
        
        // Layer 2: Composer
        log("\nLayer 2: Deploying Composer", 'info');
        
        const composer = await deployContract(
            "ArweaveTragedyComposer",
            monsterBank.address,
            backgroundBank.address,
            itemBank.address,
            effectBank.address
        );
        deployment.contracts.composer = composer.address;
        
        // Layer 3: Legendary Bank and Metadata
        log("\nLayer 3: Deploying Legendary Bank and Metadata", 'info');
        
        const legendaryBank = await deployContract("LegendaryBank");
        deployment.contracts.legendaryBank = legendaryBank.address;
        
        const metadata = await deployContract(
            "TragedyMetadata",
            composer.address
        );
        deployment.contracts.metadata = metadata.address;
        
        // Layer 4: NFT Contract
        log("\nLayer 4: Deploying NFT Contract", 'info');
        
        const nftConfig = config.getNFTConfig();
        const bankedNFT = await deployContract(
            "BankedNFT",
            nftConfig.name,
            nftConfig.symbol,
            nftConfig.maxSupply,
            hre.ethers.utils.parseEther(nftConfig.mintFee),
            nftConfig.royaltyRate
        );
        deployment.contracts.bankedNFT = bankedNFT.address;
        
        // Set metadata bank
        log("\nSetting metadata bank on NFT contract...", 'info');
        const tx = await bankedNFT.setMetadataBank(metadata.address);
        await tx.wait();
        log("Metadata bank set successfully", 'success');
        
        // Save deployment
        const outputPaths = config.getOutputPaths(network);
        
        // Ensure deployment directory exists
        const deploymentDir = path.dirname(outputPaths.deployment);
        if (!fs.existsSync(deploymentDir)) {
            fs.mkdirSync(deploymentDir, { recursive: true });
        }
        
        // Save deployment history
        if (config.output.saveHistory) {
            fs.writeFileSync(
                outputPaths.deployment,
                JSON.stringify(deployment, null, 2)
            );
            log(`Deployment saved to: ${outputPaths.deployment}`, 'success');
        }
        
        // Update current deployment
        fs.writeFileSync(
            outputPaths.current,
            JSON.stringify(deployment, null, 2)
        );
        
        // Update viewer config
        fs.writeFileSync(
            outputPaths.viewer,
            JSON.stringify(deployment, null, 2)
        );
        log(`Viewer config updated: ${outputPaths.viewer}`, 'success');
        
        // Display summary
        console.log("\n" + "=".repeat(60));
        console.log(`${colors.bright}${colors.green}Deployment Successful!${colors.reset}`);
        console.log("=".repeat(60));
        
        console.log("\nContract Summary:");
        console.log(`  NFT Contract: ${deployment.contracts.bankedNFT}`);
        console.log(`  Metadata: ${deployment.contracts.metadata}`);
        console.log(`  Composer: ${deployment.contracts.composer}`);
        
        console.log("\nConfiguration:");
        console.log(`  Max Supply: ${nftConfig.maxSupply}`);
        console.log(`  Mint Fee: ${nftConfig.mintFee} ETH`);
        console.log(`  Royalty: ${nftConfig.royaltyRate / 100}%`);
        
        const seedConfig = config.getSeedConfig();
        console.log(`  Shuffle Seed: ${seedConfig.shuffleSeed}`);
        console.log(`  Legendary #${seedConfig.legendaryTokens.soulHarvester}: Soul Harvester`);
        console.log(`  Legendary #${seedConfig.legendaryTokens.toxicAbomination}: Toxic Abomination`);
        
        // Run post-deployment tests if enabled
        if (config.testing.runPostDeploymentTests) {
            console.log("\n" + "-".repeat(60));
            log("Running post-deployment verification...", 'info');
            
            // This will call the verify script
            const verify = require("./verify");
            await verify.verifyDeployment(deployment);
        }
        
    } catch (error) {
        log(`Deployment failed: ${error.message}`, 'error');
        console.error(error);
        process.exit(1);
    }
}

// Execute deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { deployContract, main };