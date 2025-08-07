const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🧹 Clean Deployment - Following DEPLOYMENT_GUIDE.md\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    const deployment = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        note: "Clean deployment following DEPLOYMENT_GUIDE.md",
        contracts: {}
    };

    try {
        // ========== Layer 1: Individual Banks ==========
        console.log("📚 Layer 1: Deploying Individual Banks...\n");
        
        // Monster Banks
        console.log("Deploying ArweaveMonsterBank1...");
        const MonsterBank1 = await ethers.getContractFactory("ArweaveMonsterBank1");
        const monsterBank1 = await MonsterBank1.deploy();
        await monsterBank1.deployed();
        deployment.contracts.monsterBank1 = monsterBank1.address;
        console.log("✅ MonsterBank1:", monsterBank1.address);

        console.log("Deploying ArweaveMonsterBank2...");
        const MonsterBank2 = await ethers.getContractFactory("ArweaveMonsterBank2");
        const monsterBank2 = await MonsterBank2.deploy();
        await monsterBank2.deployed();
        deployment.contracts.monsterBank2 = monsterBank2.address;
        console.log("✅ MonsterBank2:", monsterBank2.address);

        // Item Banks
        console.log("\nDeploying ArweaveItemBank1...");
        const ItemBank1 = await ethers.getContractFactory("ArweaveItemBank1");
        const itemBank1 = await ItemBank1.deploy();
        await itemBank1.deployed();
        deployment.contracts.itemBank1 = itemBank1.address;
        console.log("✅ ItemBank1:", itemBank1.address);

        console.log("Deploying ArweaveItemBank2...");
        const ItemBank2 = await ethers.getContractFactory("ArweaveItemBank2");
        const itemBank2 = await ItemBank2.deploy();
        await itemBank2.deployed();
        deployment.contracts.itemBank2 = itemBank2.address;
        console.log("✅ ItemBank2:", itemBank2.address);

        // ========== Layer 1: Main Banks ==========
        console.log("\n📚 Layer 1: Deploying Main Banks...\n");

        // Monster Main Bank
        console.log("Deploying ArweaveMonsterBank (with individual banks)...");
        const MonsterBank = await ethers.getContractFactory("ArweaveMonsterBank");
        const monsterBank = await MonsterBank.deploy(monsterBank1.address, monsterBank2.address);
        await monsterBank.deployed();
        deployment.contracts.monsterBank = monsterBank.address;
        console.log("✅ MonsterBank:", monsterBank.address);

        // Item Main Bank
        console.log("Deploying ArweaveItemBank (with individual banks)...");
        const ItemBank = await ethers.getContractFactory("ArweaveItemBank");
        const itemBank = await ItemBank.deploy(itemBank1.address, itemBank2.address);
        await itemBank.deployed();
        deployment.contracts.itemBank = itemBank.address;
        console.log("✅ ItemBank:", itemBank.address);

        // Background Bank
        console.log("\nDeploying ArweaveBackgroundBank...");
        const BackgroundBank = await ethers.getContractFactory("ArweaveBackgroundBank");
        const backgroundBank = await BackgroundBank.deploy();
        await backgroundBank.deployed();
        deployment.contracts.backgroundBank = backgroundBank.address;
        console.log("✅ BackgroundBank:", backgroundBank.address);

        // Effect Bank
        console.log("Deploying ArweaveEffectBank...");
        const EffectBank = await ethers.getContractFactory("ArweaveEffectBank");
        const effectBank = await EffectBank.deploy();
        await effectBank.deployed();
        deployment.contracts.effectBank = effectBank.address;
        console.log("✅ EffectBank:", effectBank.address);

        // ========== Layer 2: Composer ==========
        console.log("\n🎨 Layer 2: Deploying Composer...\n");

        console.log("Deploying ArweaveTragedyComposer...");
        const Composer = await ethers.getContractFactory("ArweaveTragedyComposer");
        const composer = await Composer.deploy(
            monsterBank.address,
            backgroundBank.address,
            itemBank.address,
            effectBank.address
        );
        await composer.deployed();
        deployment.contracts.composer = composer.address;
        console.log("✅ Composer:", composer.address);

        // ========== Layer 3: Metadata ==========
        console.log("\n📝 Layer 3: Deploying Metadata...\n");

        console.log("Deploying TragedyMetadata...");
        const Metadata = await ethers.getContractFactory("TragedyMetadata");
        const metadata = await Metadata.deploy(composer.address);
        await metadata.deployed();
        deployment.contracts.metadata = metadata.address;
        console.log("✅ Metadata:", metadata.address);

        // ========== Layer 4: NFT ==========
        console.log("\n🎭 Layer 4: Deploying NFT...\n");

        console.log("Deploying BankedNFT...");
        const BankedNFT = await ethers.getContractFactory("BankedNFT");
        const nft = await BankedNFT.deploy(
            "Tragedy NFT",                    // name
            "TRAGEDY",                        // symbol
            10000,                           // maxSupply
            ethers.utils.parseEther("0.01"), // mintFee (0.01 ETH)
            250                              // royaltyRate (2.5%)
        );
        await nft.deployed();
        deployment.contracts.bankedNFT = nft.address;
        console.log("✅ BankedNFT:", nft.address);

        console.log("\nSetting metadata bank on NFT...");
        const tx = await nft.setMetadataBank(metadata.address);
        await tx.wait();
        console.log("✅ Metadata bank set!");

        // ========== Save Deployment Info ==========
        const timestamp = Date.now();
        const deploymentFile = path.join(__dirname, `../deployments/clean-${hre.network.name}-${timestamp}.json`);
        fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
        console.log(`\n💾 Deployment saved to: ${deploymentFile}`);

        // Update viewer deployment.json
        const viewerDeployment = path.join(__dirname, "../viewer/deployment.json");
        fs.writeFileSync(viewerDeployment, JSON.stringify(deployment, null, 2));
        console.log(`💾 Updated viewer/deployment.json`);

        // ========== Verification ==========
        console.log("\n🔍 Verification...\n");

        // Test Token #1
        console.log("Token #1:");
        const [species, background, item, effect] = await metadata.decodeTokenId(1);
        console.log(`  Species: ${species} (${await monsterBank.getMonsterName(species)})`);
        console.log(`  Background: ${background} (${await backgroundBank.getBackgroundName(background)})`);
        console.log(`  Item: ${item} (${await itemBank.getItemName(item)})`);
        console.log(`  Effect: ${effect} (${await effectBank.getEffectName(effect)})`);

        // Test Legendaries
        console.log("\nLegendary Tokens:");
        const token1687 = await metadata.decodeTokenId(1687);
        console.log(`  #1687: S=${token1687[0]}, B=${token1687[1]}, I=${token1687[2]}, E=${token1687[3]}`);
        
        const token2097 = await metadata.decodeTokenId(2097);
        console.log(`  #2097: S=${token2097[0]}, B=${token2097[1]}, I=${token2097[2]}, E=${token2097[3]}`);

        console.log("\n✨ Clean deployment complete!");
        console.log("\n📊 Summary:");
        console.log(`  Network: ${hre.network.name}`);
        console.log(`  Total contracts: 9`);
        console.log(`  NFT Contract: ${nft.address}`);
        console.log(`  Metadata Contract: ${metadata.address}`);

    } catch (error) {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });