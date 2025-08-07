const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  const composerAddress = "0x32f2f311D444FbEe826EdB8094c4a32BaaEFfE62";
  console.log("ComposerV5:", composerAddress);

  // Create contract instance with minimal ABI
  const composerAbi = [
    "function monsterBank() view returns (address)",
    "function backgroundBank() view returns (address)",
    "function itemBank() view returns (address)",
    "function effectBank() view returns (address)",
    "function composeSVG(uint8,uint8,uint8,uint8) view returns (string)",
    "function filterParams(uint8) view returns (uint16,uint16,uint16)"
  ];
  
  const composer = new hre.ethers.Contract(composerAddress, composerAbi, deployer);
  
  try {
    // Get bank addresses
    console.log("\nGetting bank addresses...");
    const monsterBankAddr = await composer.monsterBank();
    const backgroundBankAddr = await composer.backgroundBank();
    const itemBankAddr = await composer.itemBank();
    const effectBankAddr = await composer.effectBank();
    
    console.log("MonsterBank:", monsterBankAddr);
    console.log("BackgroundBank:", backgroundBankAddr);
    console.log("ItemBank:", itemBankAddr);
    console.log("EffectBank:", effectBankAddr);
    
    // Test each bank
    const monsterBank = new hre.ethers.Contract(monsterBankAddr, [
      "function getMonsterName(uint8) view returns (string)",
      "function getMonsterSVG(uint8) view returns (string)"
    ], deployer);
    
    const backgroundBank = new hre.ethers.Contract(backgroundBankAddr, [
      "function getBackgroundName(uint8) view returns (string)",
      "function getBackgroundUrl(uint8) view returns (string)"
    ], deployer);
    
    const itemBank = new hre.ethers.Contract(itemBankAddr, [
      "function getItemName(uint8) view returns (string)",
      "function getItemSVG(uint8) view returns (string)"
    ], deployer);
    
    const effectBank = new hre.ethers.Contract(effectBankAddr, [
      "function getEffectName(uint8) view returns (string)",
      "function getEffectUrl(uint8) view returns (string)"
    ], deployer);
    
    // Test index 0 for each bank
    console.log("\nTesting banks with index 0...");
    
    try {
      const monsterName = await monsterBank.getMonsterName(0);
      console.log("✓ Monster name[0]:", monsterName);
    } catch (e) {
      console.log("✗ Monster name error:", e.message);
    }
    
    try {
      const backgroundName = await backgroundBank.getBackgroundName(0);
      console.log("✓ Background name[0]:", backgroundName);
    } catch (e) {
      console.log("✗ Background name error:", e.message);
    }
    
    try {
      const itemName = await itemBank.getItemName(0);
      console.log("✓ Item name[0]:", itemName);
    } catch (e) {
      console.log("✗ Item name error:", e.message);
    }
    
    try {
      const effectName = await effectBank.getEffectName(0);
      console.log("✓ Effect name[0]:", effectName);
    } catch (e) {
      console.log("✗ Effect name error:", e.message);
    }
    
    // Test filterParams
    console.log("\nTesting filterParams(0)...");
    try {
      const params = await composer.filterParams(0);
      console.log("✓ Filter params[0]:", params);
    } catch (e) {
      console.log("✗ Filter params error:", e.message);
    }
    
    // Test composeSVG
    console.log("\nTesting composeSVG(0,0,0,0)...");
    try {
      const svg = await composer.composeSVG(0, 0, 0, 0);
      console.log("✓ SVG generated, length:", svg.length);
      console.log("First 100 chars:", svg.substring(0, 100));
    } catch (e) {
      console.log("✗ ComposeSVG error:", e.message);
    }
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});