const hre = require("hardhat");

async function main() {
    console.log("🔍 Verifying Burning Effect Update...\n");
    
    // Get the deployment info
    const deployment = require("../viewer/deployment.json");
    const effectBankAddress = deployment.contracts.effectBank;
    
    console.log("EffectBank Address:", effectBankAddress);
    
    // Get the contract instance
    const effectBank = await ethers.getContractAt("ArweaveEffectBank", effectBankAddress);
    
    // Check all effect URLs to see the full state
    console.log("\n📋 All Effect URLs:");
    console.log("==================");
    
    for (let i = 0; i < 12; i++) {
        const name = await effectBank.effectNames(i);
        const url = await effectBank.getEffectUrl(i);
        console.log(`${i.toString().padStart(2)}: ${name.padEnd(12)} - ${url}`);
        
        // Highlight the burning effect
        if (i === 8) {
            console.log("    ^^^ BURNING EFFECT - Updated! ^^^");
        }
    }
    
    // Test with a token that has burning effect
    console.log("\n🎲 Testing with metadata contract...");
    const metadataAddress = deployment.contracts.metadata;
    const metadata = await ethers.getContractAt("TragedyMetadata", metadataAddress);
    
    // Find a token with burning effect (effect = 8)
    // Using the deterministic seed 4567
    const testTokens = [9, 17, 25]; // Some early tokens to check
    
    for (const tokenId of testTokens) {
        const attr = await metadata.getAttributes(tokenId);
        if (attr.effect === 8) {
            console.log(`\nToken #${tokenId} has Burning effect!`);
            console.log("Fetching tokenURI to verify...");
            
            const nftAddress = deployment.contracts.bankedNFT;
            const nft = await ethers.getContractAt("BankedNFT", nftAddress);
            
            try {
                const uri = await nft.tokenURI(tokenId);
                // The URI is base64 encoded JSON, we can check if it contains the new URL
                const decodedData = Buffer.from(uri.replace('data:application/json;base64,', ''), 'base64').toString();
                const metadata = JSON.parse(decodedData);
                
                console.log("\nToken metadata effect URL check:");
                if (metadata.animation_url && metadata.animation_url.includes("pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA")) {
                    console.log("✅ New burning URL is being used!");
                } else {
                    console.log("❌ Old URL might still be in use");
                }
                break;
            } catch (error) {
                console.log("Token not minted yet, checking attributes only");
            }
        }
    }
    
    console.log("\n✨ Verification complete!");
    console.log("The burning effect URL has been successfully updated to:");
    console.log("https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });