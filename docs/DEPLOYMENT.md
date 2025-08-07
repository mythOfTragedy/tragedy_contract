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
./scripts/deploy/deploy.sh                    # Uses .env RPC_URL
./scripts/deploy/deploy.sh bonsoleil          # Force specific network
./scripts/deploy/deploy.sh bonsoleil --verify # Deploy and verify

# Direct npm commands
npm run deploy:local      # Local Hardhat network
npm run deploy:testnet    # Bon-Soleil testnet
npm run deploy:bonsoleil  # Bon-Soleil testnet (alias)
npm run deploy:production # Mainnet

# Verify deployment
npm run verify:testnet
```

The deployment script automatically:
- Detects network from .env RPC_URL
- Checks prerequisites
- Compiles contracts (unless --skip-compile)
- Runs deployment
- Optionally verifies (with --verify flag)

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

### Bon-Soleil Testnet
- RPC: https://rpc.rinkeby.bonsoleil.io (example)
- Chain ID: Check in `hardhat.config.js`
- Explorer: https://explorer.bonsoleil.io

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