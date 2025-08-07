const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("📊 Generating Full Token CSV with metadata...\n");

    const deploymentData = require('../viewer/deployment.json');
    const metadata = await ethers.getContractAt("TragedyMetadata", deploymentData.contracts.metadata);

    // CSV header
    const csvRows = [
        "TokenID,Species,Equipment,Realm,Curse,Name,Description,Rarity,Synergy,SpeciesID,ItemID,BackgroundID,EffectID"
    ];

    console.log("Processing 10,000 tokens... This will take a few minutes.");
    
    for (let tokenId = 1; tokenId <= 10000; tokenId++) {
        try {
            // Get decoded IDs
            const [speciesId, backgroundId, itemId, effectId] = await metadata.decodeTokenId(tokenId);
            
            // Get metadata JSON
            const metadataJson = await metadata.getMetadata(tokenId - 1);
            const parsed = JSON.parse(metadataJson);
            
            // Extract attributes
            const species = parsed.attributes.find(a => a.trait_type === "Species").value;
            const equipment = parsed.attributes.find(a => a.trait_type === "Equipment").value;
            const realm = parsed.attributes.find(a => a.trait_type === "Realm").value;
            const curse = parsed.attributes.find(a => a.trait_type === "Curse").value;
            const rarity = parsed.attributes.find(a => a.trait_type === "Rarity").value;
            
            // Check for synergy
            const synergyAttr = parsed.attributes.find(a => a.trait_type === "Synergy");
            const synergy = synergyAttr ? synergyAttr.value : "";
            
            // Clean description (remove commas and newlines for CSV)
            const description = parsed.description.replace(/,/g, ";").replace(/\n/g, " ");
            const name = parsed.name.replace(/,/g, ";");
            
            // Add row to CSV
            csvRows.push(
                `${tokenId},${species},${equipment},${realm},${curse},"${name}","${description}",${rarity},"${synergy}",${speciesId},${itemId},${backgroundId},${effectId}`
            );
            
            // Progress indicator
            if (tokenId % 100 === 0) {
                console.log(`  Processed ${tokenId}/10000 tokens...`);
            }
        } catch (error) {
            console.error(`Error processing token ${tokenId}:`, error.message);
            csvRows.push(`${tokenId},ERROR,ERROR,ERROR,ERROR,"ERROR","${error.message}",ERROR,"",0,0,0,0`);
        }
    }

    // Write CSV file
    const csvContent = csvRows.join("\n");
    const filename = `token-metadata-${Date.now()}.csv`;
    fs.writeFileSync(filename, csvContent);
    
    console.log(`\n✅ CSV generated successfully: ${filename}`);
    console.log(`Total rows: ${csvRows.length} (1 header + 10,000 tokens)`);
    
    // Show some statistics
    console.log("\n📈 Quick Statistics:");
    
    // Count legendaries
    const legendaryCount = csvRows.filter(row => row.includes("Soul Harvester") || row.includes("Toxic Abomination")).length;
    console.log(`  Special Legendaries found: ${legendaryCount}`);
    
    // Find specific tokens
    const soulHarvester = csvRows.find(row => row.includes("Soul Harvester"));
    if (soulHarvester) {
        console.log(`  Soul Harvester: Token #${soulHarvester.split(",")[0]}`);
    }
    
    const toxicAbomination = csvRows.find(row => row.includes("Toxic Abomination"));
    if (toxicAbomination) {
        console.log(`  Toxic Abomination: Token #${toxicAbomination.split(",")[0]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });