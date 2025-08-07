const { ethers } = require("hardhat");

async function main() {
    console.log("Checking Legendary implementation...\n");
    
    const provider = new ethers.providers.JsonRpcProvider('https://dev2.bon-soleil.com/rpc');
    
    // Contract addresses
    const metadataAddress = '0x565B793c191FE9C0D9980eCDB05A1471aBA198b4';
    const legendaryBankAddress = '0xf6691E452fc377c3ea4975696bD20E3CCe4d686a';
    
    // ABIs
    const metadataABI = [
        'function getMetadata(uint256 index) view returns (string)',
        'function legendaryBank() view returns (address)'
    ];
    
    const legendaryABI = [
        'function isLegendaryId(uint256 tokenId) view returns (bool)',
        'function getLegendaryTitle(uint256 tokenId) view returns (string)',
        'function getLegendaryDescription(uint256 tokenId) view returns (string)'
    ];
    
    const metadata = new ethers.Contract(metadataAddress, metadataABI, provider);
    const legendary = new ethers.Contract(legendaryBankAddress, legendaryABI, provider);
    
    try {
        // Check if metadata points to correct legendary bank
        const linkedBank = await metadata.legendaryBank();
        console.log('Metadata linked to LegendaryBank:', linkedBank);
        console.log('Expected LegendaryBank:', legendaryBankAddress);
        console.log('Match:', linkedBank.toLowerCase() === legendaryBankAddress.toLowerCase());
        
        // Check Token #1
        console.log('\nChecking Token #1:');
        const isLegendary1 = await legendary.isLegendaryId(1);
        console.log('Is Legendary:', isLegendary1);
        
        if (isLegendary1) {
            const title1 = await legendary.getLegendaryTitle(1);
            const desc1 = await legendary.getLegendaryDescription(1);
            console.log('Title:', title1);
            console.log('Description:', desc1);
        }
        
        // Get actual metadata
        console.log('\nFetching actual metadata for Token #1...');
        const tokenData = await metadata.getMetadata(0); // index 0 for token 1
        
        if (tokenData.startsWith('data:application/json;base64,')) {
            const base64 = tokenData.replace('data:application/json;base64,', '');
            const json = Buffer.from(base64, 'base64').toString();
            const parsed = JSON.parse(json);
            console.log('Name:', parsed.name);
            console.log('Description:', parsed.description);
            console.log('Rarity:', parsed.attributes.find(a => a.trait_type === 'Rarity')?.value);
        }
        
        // Check Token #666
        console.log('\n\nChecking Token #666:');
        const isLegendary666 = await legendary.isLegendaryId(666);
        console.log('Is Legendary:', isLegendary666);
        
        if (isLegendary666) {
            const title666 = await legendary.getLegendaryTitle(666);
            console.log('Title:', title666);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });