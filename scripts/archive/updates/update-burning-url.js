const hre = require("hardhat");

async function main() {
    console.log("🔥 Updating Burning Effect URL...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("Updating with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

    // EffectBank contract address from latest deployment
    const effectBankAddress = "0x0566b56Df99bF6577484e1Bd721348213Acf51eb";
    
    // Get the contract instance
    const effectBank = await ethers.getContractAt("ArweaveEffectBank", effectBankAddress);
    
    // Verify current URL
    const burningIndex = 8; // Burning is at index 8
    const currentUrl = await effectBank.getEffectUrl(burningIndex);
    console.log("Current Burning URL:");
    console.log(currentUrl);
    
    // New URL to set
    const newUrl = "https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA";
    console.log("\nNew Burning URL:");
    console.log(newUrl);
    
    // Update the URL
    console.log("\n🔄 Updating URL...");
    const tx = await effectBank.setEffectUrl(burningIndex, newUrl);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for confirmation
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("✅ URL updated successfully!");
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Verify the update
    const updatedUrl = await effectBank.getEffectUrl(burningIndex);
    console.log("\n📋 Verification:");
    console.log("Updated URL:", updatedUrl);
    console.log("Match:", updatedUrl === newUrl ? "✅ Yes" : "❌ No");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });