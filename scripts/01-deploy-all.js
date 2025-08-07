const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("Tragedy NFT Arweave Hybrid - Formal Deployment");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("\n📋 Deployment Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Deployer:", deployer.address);
  console.log("  Balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  const deploymentLog = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  try {
    // Step 1: Deploy Base64 Library
    console.log("\n🔧 Step 1/6: Deploying Base64 Library...");
    const Base64 = await ethers.getContractFactory("contracts/libraries/Base64.sol:Base64");
    const base64 = await Base64.deploy();
    await base64.deployed();
    console.log("  ✅ Base64 deployed to:", base64.address);
    deploymentLog.contracts.base64 = base64.address;

    // Step 2: Deploy Monster Banks
    console.log("\n👾 Step 2/6: Deploying Monster Banks...");
    
    // Deploy MonsterBank1
    const ArweaveMonsterBank1 = await ethers.getContractFactory("ArweaveMonsterBank1");
    const monsterBank1 = await ArweaveMonsterBank1.deploy();
    await monsterBank1.deployed();
    console.log("  ✅ Monster Bank1 deployed to:", monsterBank1.address);
    deploymentLog.contracts.monsterBank1 = monsterBank1.address;
    
    // Deploy MonsterBank2
    const ArweaveMonsterBank2 = await ethers.getContractFactory("ArweaveMonsterBank2");
    const monsterBank2 = await ArweaveMonsterBank2.deploy();
    await monsterBank2.deployed();
    console.log("  ✅ Monster Bank2 deployed to:", monsterBank2.address);
    deploymentLog.contracts.monsterBank2 = monsterBank2.address;
    
    // Deploy main MonsterBank
    const ArweaveMonsterBank = await ethers.getContractFactory("ArweaveMonsterBank");
    const monsterBank = await ArweaveMonsterBank.deploy(monsterBank1.address, monsterBank2.address);
    await monsterBank.deployed();
    console.log("  ✅ Monster Bank (main) deployed to:", monsterBank.address);
    deploymentLog.contracts.monsterBank = monsterBank.address;

    // Verify deployment
    const werewolfName = await monsterBank.getMonsterName(0);
    console.log("  🔍 Verification: Monster 0 =", werewolfName);

    // Step 3: Deploy Item Banks
    console.log("\n⚔️ Step 3/6: Deploying Item Banks...");
    
    // Deploy ItemBank1
    const ArweaveItemBank1 = await ethers.getContractFactory("ArweaveItemBank1");
    const itemBank1 = await ArweaveItemBank1.deploy();
    await itemBank1.deployed();
    console.log("  ✅ Item Bank1 deployed to:", itemBank1.address);
    deploymentLog.contracts.itemBank1 = itemBank1.address;
    
    // Deploy ItemBank2
    const ArweaveItemBank2 = await ethers.getContractFactory("ArweaveItemBank2");
    const itemBank2 = await ArweaveItemBank2.deploy();
    await itemBank2.deployed();
    console.log("  ✅ Item Bank2 deployed to:", itemBank2.address);
    deploymentLog.contracts.itemBank2 = itemBank2.address;
    
    // Deploy main ItemBank
    const ArweaveItemBank = await ethers.getContractFactory("ArweaveItemBank");
    const itemBank = await ArweaveItemBank.deploy(itemBank1.address, itemBank2.address);
    await itemBank.deployed();
    console.log("  ✅ Item Bank (main) deployed to:", itemBank.address);
    deploymentLog.contracts.itemBank = itemBank.address;

    const crownName = await itemBank.getItemName(0);
    console.log("  🔍 Verification: Item 0 =", crownName);

    // Step 4: Deploy Background Bank
    console.log("\n🌍 Step 4/6: Deploying Background Bank...");
    const ArweaveBackgroundBank = await ethers.getContractFactory("ArweaveBackgroundBank");
    const backgroundBank = await ArweaveBackgroundBank.deploy();
    await backgroundBank.deployed();
    console.log("  ✅ Background Bank deployed to:", backgroundBank.address);
    deploymentLog.contracts.backgroundBank = backgroundBank.address;

    const bloodmoonName = await backgroundBank.getBackgroundName(0);
    console.log("  🔍 Verification: Background 0 =", bloodmoonName);

    // Step 5: Deploy Effect Bank
    console.log("\n✨ Step 5/6: Deploying Effect Bank...");
    const ArweaveEffectBank = await ethers.getContractFactory("ArweaveEffectBank");
    const effectBank = await ArweaveEffectBank.deploy();
    await effectBank.deployed();
    console.log("  ✅ Effect Bank deployed to:", effectBank.address);
    deploymentLog.contracts.effectBank = effectBank.address;

    const seizureName = await effectBank.getEffectName(0);
    console.log("  🔍 Verification: Effect 0 =", seizureName);

    // Step 6: Deploy Composer
    console.log("\n🎨 Step 6/6: Deploying Composer...");
    const ArweaveTragedyComposer = await ethers.getContractFactory("ArweaveTragedyComposer");
    const composer = await ArweaveTragedyComposer.deploy(
      monsterBank.address,
      itemBank.address,
      backgroundBank.address,
      effectBank.address
    );
    await composer.deployed();
    console.log("  ✅ Composer deployed to:", composer.address);
    deploymentLog.contracts.composer = composer.address;

    // Verify composer
    console.log("\n🧪 Composer deployed successfully.");
    console.log("  ✅ Arweave URLs are already initialized in BackgroundBank and EffectBank contracts");

    // Save deployment log
    const logFilename = `deployment-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(logFilename, JSON.stringify(deploymentLog, null, 2));
    console.log("\n📄 Deployment log saved to:", logFilename);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Contract Summary:");
    console.log("  Base64 Library:  ", base64.address);
    console.log("  Monster Bank:    ", monsterBank.address);
    console.log("  Item Bank:       ", itemBank.address);
    console.log("  Background Bank: ", backgroundBank.address);
    console.log("  Effect Bank:     ", effectBank.address);
    console.log("  Composer:        ", composer.address);
    console.log("\n⚠️  Next Steps:");
    console.log("  1. Run script 03-test-composition.js to verify SVG generation");
    console.log("  2. Deploy NFT contract using this composer");
    console.log("  3. (Optional) Run script 02-update-urls.js if you need to change Arweave URLs");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });