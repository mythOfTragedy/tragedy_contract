# Production Deployment Guide

## Prerequisites

1. Ensure you have the private key for the deployer account
2. Have sufficient ETH/tokens on the target network
3. Configure the network in `hardhat.config.js`

## Files to Deploy

The following contracts need to be deployed:

### Core Contracts
1. **ArweaveMonsterBankV3** - Contains all 10 monster SVGs (including fixed Succubus)
2. **ArweaveBackgroundBank** - Contains background Arweave URLs
3. **ArweaveItemBankV3** - Contains all 12 item SVGs (Crown, Sword, Poison, etc.)
4. **ArweaveEffectBank** - Contains effect Arweave URLs

### V5 System
5. **ArweaveTragedyComposerV5** - Composes SVGs with proper filterParams
6. **TragedyMetadataV5** - Generates metadata with fixed JSON formatting
7. **BankedNFT** - The main NFT contract

## Deployment Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd tragedyContract/formal_procedure_p1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your private key and RPC URL
   ```

4. **Run deployment**
   ```bash
   npx hardhat run scripts/deploy-production.js --network [network-name]
   ```

## Post-Deployment Verification

The deployment script automatically verifies:
- Metadata generation works
- All contracts are properly linked
- JSON output is valid

## Important Notes

1. **Bank Addresses**: The V4 banks (BackgroundBank and EffectBank) contain the correct Arweave URLs, not placeholders
2. **MonsterBankV3**: Contains the fixed Succubus SVG (without explicit width/height)
3. **ComposerV5**: Has properly initialized filterParams for all 10 backgrounds
4. **MetadataV5**: Fixed JSON comma issue for valid metadata generation

## Contract Verification (Optional)

After deployment, verify contracts on Etherscan/block explorer:

```bash
npx hardhat verify --network [network-name] [contract-address] [constructor-args]
```

## Viewer Configuration

The deployment script automatically updates `viewer/deployment.json` with the new addresses.

To use the viewer:
1. Update `viewer/deployment.json` if deploying to a different network
2. Open `viewer/index.html` in a browser
3. The viewer will automatically load the contract addresses from `deployment.json`