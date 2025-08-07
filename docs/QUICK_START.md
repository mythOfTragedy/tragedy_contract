# Tragedy NFT - Quick Start Guide

## Overview
Tragedy NFT is a fully on-chain generative NFT system featuring dynamic SVG composition with 10,000 unique combinations. The system uses a hybrid architecture with small assets stored on-chain as SVGs and large assets stored on Arweave.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Some ETH on Bon-Soleil Testnet

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/generativeNft.git
cd generativeNft/monster/contract_beta
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PRIVATE_KEY=your_private_key_without_0x_prefix
BONSOLEIL_RPC_URL=https://dev2.bon-soleil.com/rpc
```

⚠️ **Security Note**: Never commit your `.env` file to version control!

## Quick Deploy (Local Testing)

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Run Local Node
```bash
npx hardhat node
```

### 3. Deploy to Local Network
In a new terminal:
```bash
npx hardhat run scripts/deploy-production.js --network localhost
```

## Production Deployment (Bon-Soleil Testnet)

### 1. Deploy Contracts
```bash
npx hardhat run scripts/deploy-production.js --network bonsoleil
```

This will deploy all contracts in the correct order:
1. Individual Banks (MonsterBank1, MonsterBank2, ItemBank1, ItemBank2)
2. Combined Banks (MonsterBank, ItemBank)
3. Asset Banks (BackgroundBank, EffectBank)
4. Composer (for SVG composition)
5. Metadata (for NFT metadata generation)
6. BankedNFT (main NFT contract)

### 2. Verify Deployment
After deployment, check `viewer/deployment.json` for contract addresses:
```bash
cat viewer/deployment.json
```

## Using the Viewer

### 1. Start Local Server
```bash
cd viewer
python3 -m http.server 8000
# or use any other local server
```

### 2. Access the Viewer
Open http://localhost:8000 in your browser

### Available Viewers:
- **index.html** - Main integrated viewer with all features
- **material-explorer.html** - Browse all assets (monsters, items, backgrounds, effects)
- **composer-explorer.html** - Test SVG composition
- **banked-metadata-explorer.html** - Explore NFT metadata

## Features

### Material Explorer
- Browse all 10 monsters (Werewolf, Vampire, Ghost, etc.)
- View all 10 items (Crown, Sword, Shield, etc.)
- See all 10 backgrounds with Arweave images
- Preview all 10 effects with Arweave animations

### Composer Explorer
- Test different combinations of species, equipment, realm, and curse
- Generate random compositions
- View the resulting SVG with all layers combined

### NFT Viewer
- Connect MetaMask wallet
- Mint new NFTs (0.01 ETH per mint)
- View your minted NFTs
- See metadata including synergies and rarity

## Contract Architecture

### Main Contracts:
- **BankedNFT**: ERC721 NFT with ERC2981 royalty support
- **Metadata**: Generates dynamic metadata with synergies
- **Composer**: Combines all layers into final SVG

### Bank Contracts:
- **MonsterBank**: Stores 10 monster SVGs on-chain
- **ItemBank**: Stores 10 item SVGs on-chain
- **BackgroundBank**: Stores Arweave URLs for backgrounds
- **EffectBank**: Stores Arweave URLs for effects

## Current Deployment (Bon-Soleil Testnet)

| Contract | Address |
|----------|---------|
| BankedNFT | 0xdEa70EcCd1eb4CbCD8ff55Ca6233bf90C7c1f171 |
| Metadata | 0x446697246d89Ac256a48359a5b6DeAEb29D192Db |
| Composer | 0xC0a517f366aFb56640eD2eD92C8957a8C9007adD |
| MonsterBank | 0x707610EC610Af7cB3CA6edF7a8CE736Ce46C06FB |
| ItemBank | 0xcFc372b96562D3658aCEE081c9977Fad33D82e92 |
| BackgroundBank | 0x33F0466024c54327d1EFb7Bb732e52932bE5FaB7 |
| EffectBank | 0xc01ECc429fa7FCce0A9633Fbb81A3c43eac89E6c |

## Bon-Soleil Testnet Configuration

Add to MetaMask:
- **Network Name**: Bon-Soleil Testnet
- **RPC URL**: https://dev2.bon-soleil.com/rpc
- **Chain ID**: 21201
- **Currency Symbol**: SSOL
- **Block Explorer**: https://explorer.dev2.bon-soleil.com

## Key Features
- ✅ 10,000 unique combinations (10×10×10×10)
- ✅ Fully on-chain SVG for monsters and items
- ✅ Arweave storage for large backgrounds and effects
- ✅ Dynamic metadata with synergy system
- ✅ ERC2981 royalty standard (2.5%)
- ✅ No technical metadata exposure (clean user experience)
- ✅ Direct gateway URLs (no 302 redirect issues)

## Troubleshooting

### "Failed to load deployment configuration"
- Make sure you've deployed the contracts first
- Check that `viewer/deployment.json` exists

### MetaMask Connection Issues
- Ensure you're on Bon-Soleil Testnet
- Check that your wallet has some SSOL for gas

### Images Not Loading
- The contracts use direct Arweave gateway URLs
- All images should load without redirect issues
- Check browser console for any errors

## Development Tips

### Running Tests
```bash
npx hardhat test
```

### Gas Estimation
Current deployment costs approximately:
- Total: ~0.5 SSOL on Bon-Soleil Testnet
- Each mint: 0.01 ETH + gas

### Updating Arweave URLs
If you need to update background/effect URLs:
```bash
npx hardhat run scripts/02-update-urls.js --network bonsoleil
```

## Support
For issues or questions:
- Create an issue on GitHub
- Check existing documentation in `/docs`
- Review contract interfaces in `/contracts`

## License
MIT License - see LICENSE file for details