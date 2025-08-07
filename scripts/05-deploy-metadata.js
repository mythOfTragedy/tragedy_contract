const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("============================================================");
    console.log("Deploying TragedyMetadata Contract");
    console.log("============================================================");

    const [deployer] = await ethers.getSigners();
    console.log("\n📋 Deployment Info:");
    console.log(`  Deployer: ${deployer.address}`);
    console.log(`  Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);

    // Read existing deployment to get composer address
    const deploymentPath = path.join(__dirname, "../viewer/deployment.json");
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    
    if (!deployment.contracts.composer) {
        throw new Error("Composer contract not found in deployment.json. Deploy contracts first!");
    }

    console.log(`\n📍 Using Composer: ${deployment.contracts.composer}`);

    // Deploy Metadata contract
    console.log("\n🎨 Deploying TragedyMetadata...");
    const TragedyMetadata = await ethers.getContractFactory("TragedyMetadata");
    const metadata = await TragedyMetadata.deploy(deployment.contracts.composer);
    await metadata.deployed();
    console.log(`  ✅ TragedyMetadata deployed to: ${metadata.address}`);

    // Update deployment.json
    deployment.contracts.metadata = metadata.address;
    deployment.timestamp = new Date().toISOString();
    
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log("\n📄 Updated viewer/deployment.json");

    // Create deployment log
    const deploymentLog = {
        network: network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            metadata: metadata.address,
            composer: deployment.contracts.composer
        }
    };

    const logFilename = `metadata-deployment-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(logFilename, JSON.stringify(deploymentLog, null, 2));
    console.log(`📄 Deployment log saved to: ${logFilename}`);

    console.log("\n============================================================");
    console.log("METADATA DEPLOYMENT COMPLETE!");
    console.log("============================================================");
    console.log(`\n📊 Contract Summary:`);
    console.log(`  TragedyMetadata: ${metadata.address}`);
    console.log(`  Composer: ${deployment.contracts.composer}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });