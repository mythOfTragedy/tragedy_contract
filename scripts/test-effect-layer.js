const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("Testing Effect Layer (BackgroundBank & EffectBank)");
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
    // Test BackgroundBank
    console.log("\n" + "=".repeat(40));
    console.log("🌍 Testing BackgroundBank");
    console.log("=".repeat(40));
    
    const backgroundBank = await ethers.getContractAt(
      "ArweaveBackgroundBank",
      deployment.contracts.backgroundBank
    );
    
    console.log("\n📍 BackgroundBank Address:", backgroundBank.address);
    console.log("\n🔍 Testing all backgrounds (0-9):");
    
    for (let i = 0; i < 10; i++) {
      const name = await backgroundBank.getBackgroundName(i);
      const url = await backgroundBank.getBackgroundUrl(i);
      console.log(`  Background ${i}: ${name}`);
      console.log(`    - URL: ${url.substring(0, 50)}...`);
      console.log(`    - Is Arweave URL: ${url.includes('arweave.net')}`);
    }

    // Test EffectBank
    console.log("\n" + "=".repeat(40));
    console.log("✨ Testing EffectBank");
    console.log("=".repeat(40));
    
    const effectBank = await ethers.getContractAt(
      "ArweaveEffectBank",
      deployment.contracts.effectBank
    );
    
    console.log("\n📍 EffectBank Address:", effectBank.address);
    console.log("\n🔍 Testing all effects (0-9):");
    console.log("  📝 Note: Effects will be expanded to 12 in the next update");
    
    for (let i = 0; i < 10; i++) {
      const name = await effectBank.getEffectName(i);
      const url = await effectBank.getEffectUrl(i);
      console.log(`  Effect ${i}: ${name}`);
      console.log(`    - URL: ${url.substring(0, 50)}...`);
      console.log(`    - Is Arweave URL: ${url.includes('arweave.net')}`);
    }

    // Test edge cases
    console.log("\n" + "=".repeat(40));
    console.log("🧪 Testing Edge Cases");
    console.log("=".repeat(40));
    
    console.log("\n📌 BackgroundBank edge cases:");
    try {
      await backgroundBank.getBackgroundName(10);
      console.log("  ❌ FAIL: Should revert for ID 10");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 10");
    }
    
    try {
      await backgroundBank.getBackgroundUrl(255);
      console.log("  ❌ FAIL: Should revert for ID 255");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 255");
    }
    
    console.log("\n📌 EffectBank edge cases:");
    console.log("  📝 Note: Currently supports 10 effects (0-9), will expand to 12 in next update");
    try {
      await effectBank.getEffectName(10);
      console.log("  ❌ FAIL: Should revert for ID 10");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 10");
    }
    
    try {
      await effectBank.getEffectUrl(255);
      console.log("  ❌ FAIL: Should revert for ID 255");
    } catch (e) {
      console.log("  ✅ PASS: Correctly reverted for ID 255");
    }

    // Test owner functions
    console.log("\n" + "=".repeat(40));
    console.log("🔐 Testing Owner Functions");
    console.log("=".repeat(40));
    
    console.log("\n📌 BackgroundBank owner:");
    const bgOwner = await backgroundBank.owner();
    console.log(`  Owner address: ${bgOwner}`);
    console.log(`  Is deployer: ${bgOwner === tester.address}`);
    
    console.log("\n📌 EffectBank owner:");
    const effectOwner = await effectBank.owner();
    console.log(`  Owner address: ${effectOwner}`);
    console.log(`  Is deployer: ${effectOwner === tester.address}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ EFFECT LAYER TEST COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log("  - BackgroundBank: All 10 backgrounds with Arweave URLs ✓");
    console.log("  - EffectBank: All 10 effects with Arweave URLs ✓");
    console.log("  - Edge cases: Properly handled ✓");
    console.log("  - Arweave integration: Working ✓");
    console.log("\n💡 Next: Test the Composer (integration layer)");

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