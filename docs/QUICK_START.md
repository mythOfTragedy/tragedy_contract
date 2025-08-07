# Tragedy NFT - Quick Start Guide

## Overview
Tragedy NFT is a fully on-chain generative NFT system featuring dynamic SVG composition with 10,000 unique combinations. The system uses a hybrid architecture with small assets stored on-chain as SVGs and large assets stored on Arweave.

## Prerequisites
- Node.js (v18 or higher recommended, v16 minimum)
- npm or yarn
- MetaMask wallet
- Some ETH for gas fees (testnet or mainnet)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mythOfTragedy.git
cd mythOfTragedy/main_contract
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
```

⚠️ **Security Note**: Never commit your `.env` file to version control!

## Quick Deploy (Local Testing)

### 1. Start Hardhat Node
In a separate terminal, start the local blockchain:
```bash
npx hardhat node
```
⚠️ **Important**: Keep this terminal running throughout your testing session

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Deploy All Contracts (Sequential Deployment)
Run the deployment scripts in order:

```bash
# Deploy all base contracts
npx hardhat run scripts/01-deploy-all.js --network localhost

# Update Arweave URLs
npx hardhat run scripts/02-update-urls.js --network localhost

# Test composition (optional)
npx hardhat run scripts/03-test-composition.js --network localhost

# Deploy NFT contracts
npx hardhat run scripts/04-deploy-nft.js --network localhost

# Test minting
npx hardhat run scripts/05-test-minting.js --network localhost
```

**Alternative**: One-line deployment (for experienced users)
```bash
npx hardhat run scripts/01-deploy-all.js --network localhost && \
npx hardhat run scripts/02-update-urls.js --network localhost && \
npx hardhat run scripts/04-deploy-nft.js --network localhost
```

## Production Deployment (Bon-Soleil Testnet)

### 1. Configure Network
Add to your `.env`:
```
BONSOLEIL_RPC_URL=https://dev2.bon-soleil.com/rpc
```

### 2. Deploy to Testnet
```bash
npx hardhat run scripts/deploy-production.js --network bonsoleil
```

This script handles the complete deployment in the correct order.

## Contract Architecture

### Deployment Order (Critical!)
1. **Base64 Library** - Required by other contracts
2. **Bank1/Bank2 Contracts** - MonsterBank1/2, ItemBank1/2
3. **Main Bank Contracts** - MonsterBank, ItemBank (require Bank1/2 addresses)
4. **Asset Banks** - BackgroundBank, EffectBank
5. **Composer** - Requires all bank addresses
6. **Metadata** - Requires composer address
7. **BankedNFT** - Main NFT contract (requires metadata setup)

### Contract Dependencies
```
Base64
  └── Used by multiple contracts

MonsterBank1, MonsterBank2
  └── MonsterBank (requires both addresses)

ItemBank1, ItemBank2
  └── ItemBank (requires both addresses)

All Banks
  └── ArweaveTragedyComposer (requires all bank addresses)
      └── TragedyMetadata (requires composer address)
          └── BankedNFT (requires metadata address)
```

## Common Issues and Solutions

### 1. "missing argument: in Contract constructor"
**Cause**: Bank contracts require sub-bank addresses  
**Solution**: Deploy Bank1 and Bank2 before main Banks

### 2. "Artifact for contract TragedyMythNFT not found"
**Cause**: Contract was renamed to BankedNFT  
**Solution**: Use `BankedNFT` in all scripts

### 3. "call revert exception" on fresh deployment
**Cause**: Hardhat network was reset  
**Solution**: Redeploy all contracts from step 1

### 4. BankedNFT deployment fails
**Cause**: Missing constructor arguments  
**Solution**: Provide all 5 required arguments:
```javascript
const nft = await BankedNFT.deploy(
  "Tragedy NFT: The Mythical Cursed-Nightmare", // name
  "TRAGEDY",                                     // symbol
  10000,                                         // maxSupply
  ethers.utils.parseEther("0.01"),              // mintFee
  250                                           // royaltyRate (2.5%)
);
```

### 5. URL update fails for EffectBank
**Cause**: Contract state issue on local network  
**Note**: Usually works fine on actual testnets

## Using the Viewer

### 1. Update Deployment Configuration
After deployment, copy the deployment file to viewer:
```bash
cp deployment-hardhat-*.json viewer/deployment.json
```

### 2. Start Local Server
```bash
cd viewer
python3 -m http.server 8000
# or use any other local server like http-server, live-server, etc.
```

### 3. Access the Viewer
Open http://localhost:8000 in your browser

### Available Viewers:
- **index.html** - Main integrated viewer with all features
- **material-explorer.html** - Browse all assets
- **composer-explorer.html** - Test SVG composition
- **banked-metadata-explorer.html** - Explore NFT metadata

## Testing Your Deployment

### 1. Check Contract Deployment
Look for a deployment file created after running scripts:
```bash
ls deployment-*.json
```

### 2. Verify Contract Addresses
```bash
cat deployment-hardhat-*.json | grep address
```

### 3. Test Minting
The mint test script will:
- Mint a single NFT
- Retrieve and display metadata
- Test multiple mints

## Bon-Soleil Testnet Configuration

Add to MetaMask:
- **Network Name**: Bon-Soleil Testnet
- **RPC URL**: https://dev2.bon-soleil.com/rpc
- **Chain ID**: 21201
- **Currency Symbol**: SSOL
- **Block Explorer**: https://explorer.dev2.bon-soleil.com

## Development Tips

### Gas Optimization
The contracts use:
- `viaIR: true` for better optimization
- `runs: 100` optimized for deployment size

### Checking Logs
Deployment scripts create timestamped log files:
```bash
ls deployment-*.json
```

### Running Individual Tests
```bash
# Test specific functionality
npx hardhat run scripts/test-metadata-v5.js --network localhost
npx hardhat run scripts/test-synergies.js --network localhost
```

## Troubleshooting Checklist

- [ ] Is Hardhat node running in a separate terminal?
- [ ] Did you run the scripts in the correct order (01→02→03→04→05)?
- [ ] Is your `.env` file properly configured?
- [ ] Are you using the correct network flag (localhost/hardhat/bonsoleil)?
- [ ] Did you update the viewer's deployment.json after deployment?

## Support

For additional help:
- Review the [Deployment Test Report](./DEPLOYMENT_TEST_REPORT.md)
- Check contract documentation in `/docs`
- Create an issue on GitHub with error messages and steps to reproduce

## License
MIT License - see LICENSE file for details