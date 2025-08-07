const hre = require("hardhat");
const fs = require("fs");

// Actual Arweave URLs from existing deployment
const ARWEAVE_URLS = {
  backgrounds: {
    0: "https://arweave.net/XeooYFmf_rvME-cLCDB-E-F1fOrdUiTSGOoz1q_lONI", // bloodmoon
    1: "https://arweave.net/7f4Xexbjb24aOw2z4soba6zaAeYQSWkr1pYAKkZ5h7c", // abyss
    2: "https://arweave.net/NBKiR7O_jrBddYDNvdIMfW7t0sc5aIiXuy508WfwPh4", // decay
    3: "https://arweave.net/xFCvtZudtVi8G1ZBSrv59928Xuf68bqtb5z2kDQx50Y", // corruption
    4: "https://arweave.net/fT6SUmXAD1DLbVzNkQuKTiN65l-TlPwI6CGXZiZzeIo", // venom
    5: "https://arweave.net/ca3HmME0N1wayBzp03TU9hACYAriGsdd3jURVXhfXHw", // void
    6: "https://arweave.net/0iMntcJN_7P07V4T5euOk9uVEzhqvoC6vRIxAnCV48U", // inferno
    7: "https://arweave.net/bA-7-CU4rveHGA9usO6_TEVucSm1vk6t9-6CPB-0PSQ", // frost
    8: "https://arweave.net/uNVu9Pori_7pEFJ1-WaNg_h3QT0ISdHQf0B_MAXZkgo", // ragnarok
    9: "https://arweave.net/-ZaY-UbqeGLe99zTv1SuFQi39frnTmTDn_g5noQ4bmI"  // shadow
  },
  effects: {
    0: "https://arweave.net/8szL-F1P2dHg3XLlYA5EXf3BVzQGfeH_CF_B-MjuNE4", // seizure
    1: "https://arweave.net/DdiqAGyJ4XDW1EFdgKBXo6fStbW-Ks2Y3f3AM96A2A0", // mindblast
    2: "https://arweave.net/1-QnPkLT5KI7eQD420wrB3m7n9hXj77rTpanb5773A0", // confusion
    3: "https://arweave.net/TdHsWKEvCIaKhgUcaGVpbs5bLE2V5metBywUhN81Ay4", // meteor
    4: "https://arweave.net/gj9yctWGFj2QhsNxLIFdtPLedkZxz460wVjdc3DwKko", // bats
    5: "https://arweave.net/aIAfVjyQEPzqqn6OtABZzFJg2yYSUWdet3Zt0EAzPnQ", // poisoning
    6: "https://arweave.net/23iGDqX0Uok653Hy3oo1o_Y-haNnzcHMW1LPmOi8IwI", // lightning
    7: "https://arweave.net/dQ5Y3zR80WV6KNnoh214zRk--xEdnMdKtDxI-YMGITM", // blizzard
    8: "https://arweave.net/5dC56SGjfZd29Jb_NIlwcUBYtm0VrkE1q53EsN52ZTA", // burning
    9: "https://arweave.net/M2iMAG1UD9QpqF9OkkUrK56LlLmjhFaeN0fqSyUxPvU"  // brainwash
  }
};

async function main() {
  console.log("=".repeat(60));
  console.log("Updating Arweave URLs");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("\n📋 Update Info:");
  console.log("  Network:", hre.network.name);
  console.log("  Updater:", deployer.address);

  // Read deployment file to get contract addresses
  const deployment = require('../viewer/deployment.json');

  console.log("📄 Using deployment from viewer/deployment.json");
  console.log("🌐 Network:", deployment.network);

  try {
    // Get contract instances
    const backgroundBank = await ethers.getContractAt(
      "ArweaveBackgroundBank",
      deployment.contracts.backgroundBank
    );
    const effectBank = await ethers.getContractAt(
      "ArweaveEffectBank",
      deployment.contracts.effectBank
    );

    // Update Background URLs
    console.log("\n🌍 Updating Background URLs...");
    const bgIds = Object.keys(ARWEAVE_URLS.backgrounds).map(k => parseInt(k));
    const bgUrls = bgIds.map(id => ARWEAVE_URLS.backgrounds[id]);
    
    console.log("  📝 Updating", bgIds.length, "background URLs...");
    const bgTx = await backgroundBank.setMultipleUrls(bgIds, bgUrls);
    console.log("  📡 Transaction:", bgTx.hash);
    await bgTx.wait();
    console.log("  ✅ Background URLs updated!");

    // Verify a background URL
    const verifyBg = await backgroundBank.getBackgroundUrl(0);
    console.log("  🔍 Verification - Bloodmoon URL:", verifyBg.substring(0, 50) + "...");

    // Update Effect URLs
    console.log("\n✨ Updating Effect URLs...");
    const effectIds = Object.keys(ARWEAVE_URLS.effects).map(k => parseInt(k));
    const effectUrls = effectIds.map(id => ARWEAVE_URLS.effects[id]);
    
    console.log("  📝 Updating", effectIds.length, "effect URLs...");
    const effectTx = await effectBank.setMultipleUrls(effectIds, effectUrls);
    console.log("  📡 Transaction:", effectTx.hash);
    await effectTx.wait();
    console.log("  ✅ Effect URLs updated!");

    // Verify an effect URL
    const verifyEffect = await effectBank.getEffectUrl(0);
    console.log("  🔍 Verification - Seizure URL:", verifyEffect.substring(0, 50) + "...");

    // Test composition with real URLs
    console.log("\n🧪 Testing composition with real Arweave URLs...");
    const composer = await ethers.getContractAt(
      "ArweaveTragedyComposer",
      deployment.contracts.composer
    );
    
    const testSvg = await composer.composeSVG(1, 4, 1, 1);
    console.log("  📏 Generated SVG length:", testSvg.length, "characters");
    console.log("  🎯 Contains Arweave URL:", testSvg.includes("arweave.net"));
    console.log("  🎨 Contains filter:", testSvg.includes("filter="));
    console.log("  🖼️ Contains base64:", testSvg.includes("base64,"));

    console.log("\n" + "=".repeat(60));
    console.log("URL UPDATE COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n✅ All Arweave URLs have been set");
    console.log("📋 Background Bank:", deployment.contracts.backgroundBank);
    console.log("📋 Effect Bank:", deployment.contracts.effectBank);
    console.log("\n💡 Next: Run 03-test-composition.js or open viewer/index.html");

  } catch (error) {
    console.error("\n❌ Update failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });