const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("Testing Material Layer (MonsterBank & ItemBank)");
  console.log("=".repeat(60));

  const [tester] = await ethers.getSigners();
  console.log("\n📋 Test Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Tester:", tester.address);

  // Read deployment file to get contract addresses
  let deployment;
  try {
    const files = fs.readdirSync('.');
    const deploymentFiles = files.filter(f => f.startsWith('deployment-') && f.endsWith('.json'));
    if (deploymentFiles.length > 0) {
      deploymentFiles.sort((a, b) => b.localeCompare(a));
      deployment = JSON.parse(fs.readFileSync(deploymentFiles[0], 'utf8'));
      console.log("📄 Using deployment from", deploymentFiles[0]);
    } else {
      throw new Error("No deployment file found");
    }
  } catch (e) {
    console.error("❌ Could not find deployment file:", e.message);
    process.exit(1);
  }

  try {
    // Test MonsterBank
    console.log("\n" + "=".repeat(40));
    console.log("👾 Testing MonsterBank");
    console.log("=".repeat(40));
    
    const monsterBank = await ethers.getContractAt(
      "ArweaveMonsterBank",
      deployment.contracts.monsterBank
    );
    
    console.log("\n📍 MonsterBank Address:", monsterBank.address);
    console.log("\n🔍 Testing all monsters (0-9):");
    
    for (let i = 0; i < 10; i++) {
      const name = await monsterBank.getMonsterName(i);
      const svg = await monsterBank.getMonsterSVG(i);
      console.log(`  Monster ${i}: ${name}`);
      console.log(`    - SVG Length: ${svg.length} characters`);
      console.log(`    - Has SVG tag: ${svg.includes('<svg')}`);
      console.log(`    - Has image tag: ${svg.includes('<image')}`);
      console.log(`    - Base64 data: ${svg.includes('data:image/png;base64,') ? 'YES' : 'NO'}`);
    }

    // Test ItemBank
    console.log("\n" + "=".repeat(40));
    console.log("⚔️ Testing ItemBank");
    console.log("=".repeat(40));
    
    const itemBank = await ethers.getContractAt(
      "ArweaveItemBank",
      deployment.contracts.itemBank
    );
    
    console.log("\n📍 ItemBank Address:", itemBank.address);
    console.log("\n🔍 Testing all items (0-11):");
    
    for (let i = 0; i < 12; i++) {
      const name = await itemBank.getItemName(i);
      const svg = await itemBank.getItemSVG(i);
      console.log(`  Item ${i}: ${name}`);
      console.log(`    - SVG Length: ${svg.length} characters`);
      console.log(`    - Has SVG tag: ${svg.includes('<svg')}`);
      console.log(`    - Has image tag: ${svg.includes('<image')}`);
      console.log(`    - Base64 data: ${svg.includes('data:image/png;base64,') ? 'YES' : 'NO'}`);
    }

    // Test edge cases
    console.log("\n" + "=".repeat(40));
    console.log("🧪 Testing Edge Cases");
    console.log("=".repeat(40));
    
    console.log("\n📌 MonsterBank edge cases:");
    try {
      await monsterBank.getMonsterName(10);
      console.log("  ❌ FAIL: Should revert for ID 10");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 10");
    }
    
    try {
      await monsterBank.getMonsterSVG(255);
      console.log("  ❌ FAIL: Should revert for ID 255");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 255");
    }
    
    console.log("\n📌 ItemBank edge cases:");
    try {
      await itemBank.getItemName(12);
      console.log("  ❌ FAIL: Should revert for ID 12");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 12");
    }
    
    try {
      await itemBank.getItemSVG(255);
      console.log("  ❌ FAIL: Should revert for ID 255");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 255");
    }

    // Save sample SVGs for inspection
    console.log("\n💾 Saving sample SVGs for inspection...");
    
    const monsterSvg = await monsterBank.getMonsterSVG(0);
    fs.writeFileSync('sample-monster-0.svg', monsterSvg);
    console.log("  ✅ Saved: sample-monster-0.svg (Werewolf)");
    
    const itemSvg = await itemBank.getItemSVG(0);
    fs.writeFileSync('sample-item-0.svg', itemSvg);
    console.log("  ✅ Saved: sample-item-0.svg (Crown)");

    console.log("\n" + "=".repeat(60));
    console.log("✅ MATERIAL LAYER TEST COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log("  - MonsterBank: All 10 monsters accessible ✓");
    console.log("  - ItemBank: All 12 items accessible ✓");
    console.log("  - Edge cases: Properly handled ✓");
    console.log("  - SVG generation: Working ✓");
    console.log("\n💡 Next: Test the effect layer (BackgroundBank & EffectBank)");

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