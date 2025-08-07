const hre = require("hardhat");

async function main() {
  console.log("Testing Composer with Effects 10 and 11...");
  
  const composer = await ethers.getContractAt(
    "ArweaveTragedyComposer",
    "0xA55FDa03ddc82f5D66f82C3A886ee7a842dB126f"
  );
  
  const effectBank = await ethers.getContractAt(
    "ArweaveEffectBank", 
    "0xeBC4cF0c174557cd739a94E8ba2085c4ACbe07CE"
  );
  
  // First check if EffectBank has 12 effects
  console.log("\nChecking EffectBank...");
  try {
    const effect10 = await effectBank.getEffectName(10);
    const effect11 = await effectBank.getEffectName(11);
    console.log("Effect 10:", effect10);
    console.log("Effect 11:", effect11);
  } catch (e) {
    console.error("Error getting effect names:", e.message);
  }
  
  // Try composing with basic parameters
  console.log("\nTesting basic composition (no new effects)...");
  try {
    const svg1 = await composer.composeSVG(0, 0, 0, 0);
    console.log("✅ Basic composition works");
  } catch (e) {
    console.error("❌ Basic composition failed:", e.message);
  }
  
  // Try composing with effect 10
  console.log("\nTesting with Effect 10 (Blackout)...");
  try {
    const svg10 = await composer.composeSVG(0, 0, 0, 10);
    console.log("✅ Composition with effect 10 works");
  } catch (e) {
    console.error("❌ Composition with effect 10 failed:", e.message);
  }
  
  // Try composing with effect 11
  console.log("\nTesting with Effect 11 (Matrix)...");
  try {
    const svg11 = await composer.composeSVG(0, 0, 0, 11);
    console.log("✅ Composition with effect 11 works");
  } catch (e) {
    console.error("❌ Composition with effect 11 failed:", e.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });