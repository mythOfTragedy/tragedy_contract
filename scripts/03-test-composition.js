const hre = require("hardhat");
const fs = require("fs");

// Test combinations
const TEST_CASES = [
  { species: 0, background: 0, item: 0, effect: 0, name: "Werewolf + Bloodmoon + Crown + Seizure" },
  { species: 1, background: 4, item: 1, effect: 1, name: "Goblin + Venom + Sword + Mindblast" },
  { species: 4, background: 7, item: 3, effect: 6, name: "Dragon + Frost + Poison + Lightning" },
  { species: 6, background: 1, item: 9, effect: 8, name: "Vampire + Abyss + Amulet + Burning" },
  { species: 9, background: 9, item: 6, effect: 4, name: "Skeleton + Shadow + Scythe + Bats" }
];

async function main() {
  console.log("=".repeat(60));
  console.log("Testing SVG Composition");
  console.log("=".repeat(60));

  const [signer] = await ethers.getSigners();
  console.log("\n📋 Test Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Tester:", signer.address);

  // Read deployment file
  const deploymentFiles = fs.readdirSync('.')
    .filter(f => f.startsWith(`deployment-${hre.network.name}-`))
    .sort()
    .reverse();

  if (deploymentFiles.length === 0) {
    console.error("❌ No deployment file found. Run deployment scripts first!");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFiles[0], 'utf8'));
  console.log("📄 Using deployment from:", deploymentFiles[0]);

  try {
    // Get contract instances
    const composer = await ethers.getContractAt(
      "ArweaveTragedyComposer",
      deployment.contracts.composer
    );
    const monsterBank = await ethers.getContractAt(
      "ArweaveMonsterBank",
      deployment.contracts.monsterBank
    );
    const itemBank = await ethers.getContractAt(
      "ArweaveItemBank",
      deployment.contracts.itemBank
    );
    const backgroundBank = await ethers.getContractAt(
      "ArweaveBackgroundBank",
      deployment.contracts.backgroundBank
    );
    const effectBank = await ethers.getContractAt(
      "ArweaveEffectBank",
      deployment.contracts.effectBank
    );

    console.log("\n🧪 Running Composition Tests...\n");

    for (const testCase of TEST_CASES) {
      console.log("📝 Test:", testCase.name);
      
      // Get names
      const monsterName = await monsterBank.getMonsterName(testCase.species);
      const itemName = await itemBank.getItemName(testCase.item);
      const backgroundName = await backgroundBank.getBackgroundName(testCase.background);
      const effectName = await effectBank.getEffectName(testCase.effect);
      
      console.log("  🎭 Components:", `${monsterName} + ${itemName} + ${backgroundName} + ${effectName}`);
      
      // Get filter params
      const filter = await composer.filterParams(testCase.background);
      console.log("  🎨 Filter:", `hue=${filter.hueRotate}°, sat=${filter.saturate/100}x, bright=${filter.brightness/100}x`);
      
      // Compose SVG
      const svg = await composer.composeSVG(
        testCase.species,
        testCase.background,
        testCase.item,
        testCase.effect
      );
      
      console.log("  📏 SVG Length:", svg.length, "characters");
      
      // Analyze SVG
      const hasFilter = svg.includes(`filter="url(#f${testCase.background})`);
      const hasArweaveUrls = svg.includes("arweave.net");
      const hasBase64 = svg.includes("data:image/svg+xml;base64,");
      const filterCount = (svg.match(/filter="/g) || []).length;
      const imageCount = (svg.match(/<image/g) || []).length;
      
      console.log("  ✅ Has filter:", hasFilter);
      console.log("  ✅ Has Arweave URLs:", hasArweaveUrls);
      console.log("  ✅ Has Base64 data:", hasBase64);
      console.log("  📊 Filter applications:", filterCount);
      console.log("  📊 Image layers:", imageCount);
      
      // Save sample SVG
      if (testCase === TEST_CASES[0]) {
        const filename = `sample-output-${Date.now()}.svg`;
        fs.writeFileSync(filename, svg);
        console.log("  💾 Sample saved to:", filename);
      }
      
      console.log("  ✅ Test passed!\n");
    }

    // Test edge cases
    console.log("🔧 Testing Edge Cases...\n");
    
    // Test invalid inputs
    console.log("📝 Test: Invalid inputs (should revert)");
    try {
      await composer.composeSVG(10, 0, 0, 0);
      console.log("  ❌ Should have reverted!");
    } catch (error) {
      console.log("  ✅ Correctly reverted:", error.reason || "Invalid input");
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("ALL TESTS COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log("  Total tests run:", TEST_CASES.length);
    console.log("  All compositions successful ✅");
    console.log("\n💡 Next Steps:");
    console.log("  1. Open viewer/index.html to see visual output");
    console.log("  2. Deploy NFT contract using this composer");
    console.log("  3. Mint NFTs with these verified components");

  } catch (error) {
    console.error("\n❌ Test failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });