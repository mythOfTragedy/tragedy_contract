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
        // Parse command line arguments
        const args = process.argv.slice(2);
        const options = {
            only: null,
            from: null
        };
        
        // Parse options
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--only' && args[i + 1]) {
                options.only = args[i + 1];
                i++;
            } else if (args[i] === '--from' && args[i + 1]) {
                options.from = args[i + 1];
                i++;
            }
        }
        
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
        
        // Display deployment options
        if (options.only) {
            log(`Deployment mode: Single contract (${options.only})`, 'warning');
        } else if (options.from) {
            log(`Deployment mode: From ${options.from} onwards`, 'warning');
        } else {
            log(`Deployment mode: Full deployment`, 'info');
        }
        
        // Load existing deployment if partial deployment
        let deployment = {
            network,
            timestamp: new Date().toISOString(),
            contracts: {}
        };
        
        if (options.only || options.from) {
            try {
                const currentPath = config.getOutputPaths(network).current;
                if (fs.existsSync(currentPath)) {
                    const existing = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
                    deployment.contracts = existing.contracts || {};
                    log("Loaded existing deployment data", 'success');
                }
            } catch (e) {
                log("No existing deployment found, starting fresh", 'warning');
            }
        }
        
        console.log("\n" + "-".repeat(60));
        console.log(`${colors.bright}Starting Deployment${colors.reset}`);
        console.log("-".repeat(60) + "\n");
        
        // Contract deployment sequence
        const deploymentSteps = [
            // Layer 1: Individual Banks
            { name: 'monsterBank1', contract: 'ArweaveMonsterBank1', layer: 1, args: [] },
            { name: 'monsterBank2', contract: 'ArweaveMonsterBank2', layer: 1, args: [] },
            { name: 'itemBank1', contract: 'ArweaveItemBank1', layer: 1, args: [] },
            { name: 'itemBank2', contract: 'ArweaveItemBank2', layer: 1, args: [] },
            // Layer 1: Main Banks
            { name: 'monsterBank', contract: 'ArweaveMonsterBank', layer: 1, args: ['monsterBank1', 'monsterBank2'] },
            { name: 'itemBank', contract: 'ArweaveItemBank', layer: 1, args: ['itemBank1', 'itemBank2'] },
            { name: 'backgroundBank', contract: 'ArweaveBackgroundBank', layer: 1, args: [] },
            { name: 'effectBank', contract: 'ArweaveEffectBank', layer: 1, args: [] },
            // Layer 2: Composer
            { name: 'composer', contract: 'ArweaveTragedyComposer', layer: 2, args: ['monsterBank', 'backgroundBank', 'itemBank', 'effectBank'] },
            // Layer 3: Legendary Bank and Metadata
            { name: 'legendaryBank', contract: 'LegendaryBank', layer: 3, args: [] },
            { name: 'metadata', contract: 'TragedyMetadata', layer: 3, args: ['composer', 'legendaryBank'] },
            // Layer 4: NFT Contract
            { name: 'bankedNFT', contract: 'BankedNFT', layer: 4, args: 'nft' }
        ];
        
        // Determine starting point
        let startIndex = 0;
        if (options.from) {
            startIndex = deploymentSteps.findIndex(step => step.name === options.from);
            if (startIndex === -1) {
                throw new Error(`Unknown contract: ${options.from}`);
            }
        }
        
        // Deploy contracts
        const deployedContracts = {};
        let currentLayer = 0;
        
        for (let i = startIndex; i < deploymentSteps.length; i++) {
            const step = deploymentSteps[i];
            
            // Check if we should deploy this contract
            if (options.only && step.name !== options.only) {
                // Skip if deploying only a specific contract
                if (deployment.contracts[step.name]) {
                    deployedContracts[step.name] = await hre.ethers.getContractAt(
                        step.contract,
                        deployment.contracts[step.name]
                    );
                }
                continue;
            }
            
            // Show layer info
            if (step.layer !== currentLayer) {
                currentLayer = step.layer;
                log(`\nLayer ${currentLayer}: ${getLayerDescription(currentLayer)}`, 'info');
            }
            
            // Prepare arguments
            let args = [];
            if (step.args === 'nft') {
                const nftConfig = config.getNFTConfig();
                args = [
                    nftConfig.name,
                    nftConfig.symbol,
                    nftConfig.maxSupply,
                    hre.ethers.utils.parseEther(nftConfig.mintFee),
                    nftConfig.royaltyRate
                ];
            } else {
                args = step.args.map(argName => {
                    const address = deployment.contracts[argName] || deployedContracts[argName]?.address;
                    if (!address) {
                        throw new Error(`Required contract ${argName} not found`);
                    }
                    return address;
                });
            }
            
            // Deploy contract
            const contract = await deployContract(step.contract, ...args);
            deployedContracts[step.name] = contract;
            deployment.contracts[step.name] = contract.address;
            
            // Stop if only deploying one contract
            if (options.only) {
                break;
            }
        }
        
        // Set metadata bank if NFT was deployed
        if ((options.only === 'bankedNFT' || (!options.only && startIndex <= deploymentSteps.findIndex(s => s.name === 'bankedNFT'))) 
            && deployment.contracts.bankedNFT && deployment.contracts.metadata) {
            log("\nSetting metadata bank on NFT contract...", 'info');
            const bankedNFT = deployedContracts.bankedNFT || 
                await hre.ethers.getContractAt("BankedNFT", deployment.contracts.bankedNFT);
            const tx = await bankedNFT.setMetadataBank(deployment.contracts.metadata);
            await tx.wait();
            log("Metadata bank set successfully", 'success');
        }
        
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

function getLayerDescription(layer) {
    const descriptions = {
        1: "Deploying Bank Contracts",
        2: "Deploying Composer",
        3: "Deploying Legendary Bank and Metadata",
        4: "Deploying NFT Contract"
    };
    return descriptions[layer] || "Deploying Contracts";
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