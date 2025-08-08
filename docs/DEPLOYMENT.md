# Tragedy NFT - Deployment Guide

> 統一されたデプロイメントガイド / Unified Deployment Guide

## Overview

This guide covers the deployment process for the Tragedy NFT system using the automated `deploy-clean.js` script. The system follows a 4-layer architecture with contracts deployed in a specific order.

## Architecture

```
Layer 4: NFT Contract (BankedNFT)
         ↓
Layer 3: Metadata Contract (TragedyMetadata) + LegendaryBank
         ↓
Layer 2: Composer Contract (ArweaveTragedyComposer)
         ↓
Layer 1: Bank Contracts (Monster, Item, Background, Effect)
```

## Prerequisites

- Node.js 16+
- Hardhat configured with network settings
- Private key in `.env` file
- Sufficient ETH for deployment

## Deployment Process

### 1. Clean Deployment (Recommended)

Using the new unified deployment system:

```bash
# Compile contracts
npx hardhat compile

# Deploy using smart shell script (detects network from .env)
npm run deploy

# Or deploy with specific options
./scripts/deploy/deploy.sh                    # Uses .env configuration
./scripts/deploy/deploy.sh private            # Force private network
./scripts/deploy/deploy.sh private --verify   # Deploy and verify

# Partial deployment options
./scripts/deploy/deploy.sh --only bankedNFT   # Deploy only NFT contract
./scripts/deploy/deploy.sh --from composer    # Deploy from composer onwards

# Direct npm commands
npm run deploy:local      # Local Hardhat network
npm run deploy:testnet    # Public testnet (Sepolia)
npm run deploy:private    # Private chain (configured via .env)
npm run deploy:ethereum   # Ethereum mainnet
npm run deploy:polygon    # Polygon mainnet
npm run deploy:base       # Base mainnet

# Verify deployment
npm run verify:private    # Verify private chain deployment
npm run verify:testnet    # Verify testnet deployment
```

The deployment script automatically:
- Detects network from .env RPC_URL
- Checks prerequisites
- Compiles contracts (unless --skip-compile)
- Runs deployment
- Optionally verifies (with --verify flag)

#### Partial Deployment Options

**--only <contract>**: Deploy only a specific contract
- Useful for updating a single contract without redeploying everything
- Requires that dependent contracts are already deployed
- Example: `npm run deploy:private -- --only bankedNFT`

**--from <contract>**: Deploy from a specific contract onwards
- Useful when deployment was interrupted or when updating upper layers
- Deploys the specified contract and all contracts that come after it
- Example: `npm run deploy:private -- --from composer`

Available contract names for partial deployment:
- `monsterBank1`, `monsterBank2` (Individual Monster Banks)
- `itemBank1`, `itemBank2` (Individual Item Banks)
- `monsterBank`, `itemBank` (Main Banks)
- `backgroundBank`, `effectBank` (Single Banks)
- `composer` (Layer 2)
- `legendaryBank`, `metadata` (Layer 3)
- `bankedNFT` (Layer 4)

Legacy method (still available):
```bash
# Using old scripts with legacy: prefix
npm run legacy:deploy-workflow
```

### 2. Deployment Output

The deployment creates:
- `deployments/clean-{network}-{timestamp}.json` - Full deployment record
- `viewer/deployment.json` - Updated automatically for the web viewer

### 3. Verify Deployment

```bash
# Check legendary positions
npx hardhat run test/verify-final-deployment.js --network bonsoleil

# Test metadata generation
npx hardhat run scripts/test-metadata-v5.js --network bonsoleil
```

## Contract Details

### Token Configuration
- **Max Supply**: 10,000 NFTs
- **Mint Fee**: 0.01 ETH
- **Royalty Rate**: 2.5% (250 basis points)
- **SHUFFLE_SEED**: 4567

### Legendary Tokens
- **Soul Harvester**: Token #1687
- **Toxic Abomination**: Token #2097

### Bank Mappings

#### Monster Bank (10 types)
0. Werewolf
1. Vampire
2. Dragon
3. Goblin
4. Skeleton
5. Zombie
6. Mummy
7. Frankenstein
8. Demon
9. Succubus

#### Item Bank (10 types)
0. Crown
1. Sword
2. Shield
3. Staff
4. Amulet
5. Wine
6. Poison
7. Scythe
8. Shoulder
9. Torch

#### Background Bank (10 types)
0. Bloodmoon
1. Abyss
2. Decay
3. Corruption
4. Venom
5. Void
6. Inferno
7. Frost
8. Ragnarok
9. Shadow

#### Effect Bank (12 types)
0. Seizure
1. Mindblast
2. Confusion
3. Meteor
4. Bats
5. Poisoning
6. Lightning
7. Blizzard
8. Burning
9. Brainwash
10. Blackout
11. Matrix

## Post-Deployment

### 1. Update Frontend Configuration

If you have a frontend application:

```javascript
// Update viewer/deployment.json (done automatically)
// Update any frontend configuration files that reference contract addresses
```

### 2. Verify Contract Functionality

```bash
# Test token minting
npx hardhat run scripts/05-test-minting.js --network bonsoleil

# Check SVG composition
npx hardhat run scripts/03-test-composition.js --network bonsoleil
```

### 3. Contract Verification (Optional)

For Etherscan-compatible explorers:

```bash
npx hardhat verify --network bonsoleil <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Troubleshooting

### Common Issues

1. **"Missing dependencies"**
   ```bash
   npm install
   ```

2. **"Insufficient funds"**
   - Ensure deployer wallet has enough ETH
   - Check gas price settings in `hardhat.config.js`

3. **"Contract size exceeds limit"**
   - This is why we use split banks (Bank1, Bank2)
   - LegendaryBank handles special cases separately

4. **"Deployment directory not found"**
   ```bash
   mkdir -p deployments
   ```

## Network Configuration

### Network Types

#### Public Testnet (Sepolia)
- RPC: https://rpc.sepolia.org
- Chain ID: 11155111
- Explorer: https://sepolia.etherscan.io

#### Private Chain
- RPC: Configure in .env as RPC_URL
- Chain ID: Configure in .env as CHAIN_ID
- Explorer: Depends on your private chain

### Mainnet Deployment
Replace `bonsoleil` with your mainnet configuration:
```bash
npx hardhat run scripts/deploy-clean.js --network mainnet
```

## References

- [Effect Replacement Guide](./EFFECT_REPLACEMENT_GUIDE.md)
- [Image Replacement Guide](./IMAGE_REPLACEMENT_GUIDE.md)
- [Design Documentation](./DESIGN.md)

---

Last Updated: 2025-08-07