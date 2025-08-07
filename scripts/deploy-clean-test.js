const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🧹 Starting CLEAN DEPLOYMENT TEST...\n");
    console.log("This will deploy all 4 layers from scratch:");
    console.log("1. Bank Contracts (Monster, Item, Background, Effect)");
    console.log("2. Composer Contract");
    console.log("3. Metadata Contract");
    console.log("4. NFT Contract\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    // Track deployment addresses
    const deployment = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        note: "Clean deployment test - all 4 layers",
        contracts: {}
    };

    try {
        // Step 1: Deploy Bank Contracts
        console.log("📚 Step 1: Deploying Bank Contracts...");
        
        const ArweaveMonsterBank = await ethers.getContractFactory("ArweaveMonsterBank");
        const monsterBank = await ArweaveMonsterBank.deploy(monsterBank1.address, monsterBank2.address);
        await monsterBank.deployed();
        deployment.contracts.monsterBank = monsterBank.address;
        console.log("✅ Monster Bank deployed to:", monsterBank.address);

        const ArweaveItemBank = await ethers.getContractFactory("ArweaveItemBank");
        const itemBank = await ArweaveItemBank.deploy(itemBank1.address, itemBank2.address);
        await itemBank.deployed();
        deployment.contracts.itemBank = itemBank.address;
        console.log("✅ Item Bank deployed to:", itemBank.address);

        const ArweaveBackgroundBank = await ethers.getContractFactory("ArweaveBackgroundBank");
        const backgroundBank = await ArweaveBackgroundBank.deploy();
        await backgroundBank.deployed();
        deployment.contracts.backgroundBank = backgroundBank.address;
        console.log("✅ Background Bank deployed to:", backgroundBank.address);

        const ArweaveEffectBank = await ethers.getContractFactory("ArweaveEffectBank");
        const effectBank = await ArweaveEffectBank.deploy();
        await effectBank.deployed();
        deployment.contracts.effectBank = effectBank.address;
        console.log("✅ Effect Bank deployed to:", effectBank.address);

        // Step 2: Deploy Individual Monster/Item Banks (for rarity)
        console.log("\n📦 Deploying Individual Banks for rarity...");
        
        const ArweaveMonsterBank1 = await ethers.getContractFactory("ArweaveMonsterBank1");
        const monsterBank1 = await ArweaveMonsterBank1.deploy();
        await monsterBank1.deployed();
        deployment.contracts.monsterBank1 = monsterBank1.address;
        console.log("✅ Monster Bank 1 deployed to:", monsterBank1.address);

        const ArweaveMonsterBank2 = await ethers.getContractFactory("ArweaveMonsterBank2");
        const monsterBank2 = await ArweaveMonsterBank2.deploy();
        await monsterBank2.deployed();
        deployment.contracts.monsterBank2 = monsterBank2.address;
        console.log("✅ Monster Bank 2 deployed to:", monsterBank2.address);

        const ArweaveItemBank1 = await ethers.getContractFactory("ArweaveItemBank1");
        const itemBank1 = await ArweaveItemBank1.deploy();
        await itemBank1.deployed();
        deployment.contracts.itemBank1 = itemBank1.address;
        console.log("✅ Item Bank 1 deployed to:", itemBank1.address);

        const ArweaveItemBank2 = await ethers.getContractFactory("ArweaveItemBank2");
        const itemBank2 = await ArweaveItemBank2.deploy();
        await itemBank2.deployed();
        deployment.contracts.itemBank2 = itemBank2.address;
        console.log("✅ Item Bank 2 deployed to:", itemBank2.address);

        // Step 3: Deploy Composer
        console.log("\n🎨 Step 2: Deploying Composer Contract...");
        const ArweaveTragedyComposer = await ethers.getContractFactory("ArweaveTragedyComposer");
        const composer = await ArweaveTragedyComposer.deploy(
            monsterBank.address,
            itemBank.address,
            backgroundBank.address,
            effectBank.address,
            [monsterBank1.address, monsterBank2.address],
            [itemBank1.address, itemBank2.address]
        );
        await composer.deployed();
        deployment.contracts.composer = composer.address;
        console.log("✅ Composer deployed to:", composer.address);

        // Step 4: Deploy Metadata
        console.log("\n📝 Step 3: Deploying Metadata Contract...");
        const TragedyMetadata = await ethers.getContractFactory("TragedyMetadata");
        const metadata = await TragedyMetadata.deploy(composer.address);
        await metadata.deployed();
        deployment.contracts.metadata = metadata.address;
        console.log("✅ Metadata deployed to:", metadata.address);

        // Step 5: Deploy NFT
        console.log("\n🎭 Step 4: Deploying NFT Contract...");
        const TragedyCommonsBankedNFT = await ethers.getContractFactory("TragedyCommonsBankedNFT");
        const nft = await TragedyCommonsBankedNFT.deploy(metadata.address);
        await nft.deployed();
        deployment.contracts.bankedNFT = nft.address;
        console.log("✅ NFT deployed to:", nft.address);

        // Save deployment info
        const timestamp = Date.now();
        const cleanTestFile = path.join(__dirname, `../deployments/clean-test-${hre.network.name}-${timestamp}.json`);
        fs.writeFileSync(cleanTestFile, JSON.stringify(deployment, null, 2));
        console.log(`\n📄 Clean test deployment saved to: ${cleanTestFile}`);

        // Verification tests
        console.log("\n🔍 Running verification tests...");
        
        // Test 1: Check token #1
        console.log("\n1️⃣ Testing Token #1:");
        const [species, background, item, effect] = await metadata.decodeTokenId(1);
        console.log(`   Species: ${species} (${await monsterBank.getMonsterName(species)})`);
        console.log(`   Background: ${background} (${await backgroundBank.getBackgroundName(background)})`);
        console.log(`   Item: ${item} (${await itemBank.getItemName(item)})`);
        console.log(`   Effect: ${effect} (${await effectBank.getEffectName(effect)})`);

        // Test 2: Check legendary positions
        console.log("\n2️⃣ Testing Legendary Positions:");
        const token1687 = await metadata.decodeTokenId(1687);
        const token2097 = await metadata.decodeTokenId(2097);
        console.log(`   Token #1687: S=${token1687[0]}, B=${token1687[1]}, I=${token1687[2]}, E=${token1687[3]}`);
        console.log(`   Token #2097: S=${token2097[0]}, B=${token2097[1]}, I=${token2097[2]}, E=${token2097[3]}`);

        // Test 3: Get metadata URI
        console.log("\n3️⃣ Testing Metadata Generation:");
        const metadataURI = await metadata.getMetadata(0); // Token #1
        console.log(`   Metadata URI length: ${metadataURI.length} characters`);
        console.log(`   Starts with: ${metadataURI.substring(0, 50)}...`);

        // Test 4: Check NFT integration
        console.log("\n4️⃣ Testing NFT Integration:");
        const nftMetadataBank = await nft.metadataBank();
        console.log(`   NFT points to metadata: ${nftMetadataBank}`);
        console.log(`   Matches deployed metadata: ${nftMetadataBank === metadata.address ? "✅ YES" : "❌ NO"}`);

        console.log("\n✨ CLEAN DEPLOYMENT TEST COMPLETE!");
        console.log("\n📊 Summary:");
        console.log(`   Network: ${hre.network.name}`);
        console.log(`   NFT Contract: ${nft.address}`);
        console.log(`   Metadata Contract: ${metadata.address}`);
        console.log(`   Composer Contract: ${composer.address}`);
        console.log(`   Total contracts deployed: 9`);

        // Update viewer deployment.json for testing
        console.log("\n📝 Updating viewer/deployment.json for testing...");
        const viewerDeployment = {
            network: hre.network.name,
            timestamp: deployment.timestamp,
            note: "Clean test deployment - temporary",
            contracts: deployment.contracts
        };
        fs.writeFileSync(
            path.join(__dirname, "../viewer/deployment-clean-test.json"),
            JSON.stringify(viewerDeployment, null, 2)
        );
        console.log("✅ Created viewer/deployment-clean-test.json");
        console.log("\n⚠️  Note: This is a TEST deployment. Original deployment.json unchanged.");

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