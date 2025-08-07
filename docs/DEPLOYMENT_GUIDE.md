# Deployment Guide

## Overview
This guide covers the complete deployment process for the Tragedy of Yggdra NFT contracts and frontend configuration.

## Contract Deployment Order

### 1. Deploy All Contracts (Bottom-up approach)
```bash
npx hardhat run scripts/deploy-clean.js --network bonsoleil
```

This will deploy in the following order:
1. **Individual Banks** (MonsterBank1, MonsterBank2, ItemBank1, ItemBank2)
2. **Main Banks** (MonsterBank, ItemBank, BackgroundBank, EffectBank)
3. **LegendaryBank** (Stores legendary titles and descriptions)
4. **Composer** (ArweaveTragedyComposer)
5. **Metadata** (TragedyMetadata)
6. **NFT Contract** (BankedNFT)

### 2. Record Contract Addresses
After deployment, note the following addresses:
- **NFT Contract**: Main contract for minting
- **Metadata Contract**: Generates token metadata
- **Composer Contract**: Composes SVG images
- **LegendaryBank**: Stores legendary token data

## Frontend Configuration Updates

⚠️ **IMPORTANT**: After each deployment, you MUST update the frontend configuration files with the new contract addresses.

### 1. Update web3-integration.js
File: `/frontend/js/web3-integration.js`

```javascript
addresses: {
    8453: '0x0000000000000000000000000000000000000000',  // Base Mainnet
    84532: '0x0000000000000000000000000000000000000000', // Base Sepolia
    21201: '0xNEW_NFT_CONTRACT_ADDRESS'  // Bon Soleil Testnet
},
```

### 2. Update blockchain.json
File: `/frontend/config/blockchain.json`

Update the following addresses:
```json
{
  "networks": {
    "bonsoleil": {
      "contracts": {
        "metadataBank": {
          "address": "0xNEW_METADATA_CONTRACT_ADDRESS"
        },
        "bankedNFT": {
          "address": "0xNEW_NFT_CONTRACT_ADDRESS"
        },
        "composerV5": {
          "address": "0xNEW_COMPOSER_CONTRACT_ADDRESS"
        }
      }
    }
  }
}
```

## Verification Steps

### 1. Check Contract Deployment
After deployment, verify:
- All contracts deployed successfully
- deployment.json was created in `/deployments/` and `/viewer/`

### 2. Test Frontend Connection
1. Open the frontend in a browser
2. Connect MetaMask to Bon Soleil network
3. Try viewing a token or minting
4. Check browser console for any errors

### 3. Common Issues
- **"Cannot read metadata"**: Update metadataBank address in blockchain.json
- **"Contract not found"**: Update NFT address in web3-integration.js
- **"Invalid network"**: Ensure MetaMask is on Bon Soleil (Chain ID: 21201)

## Example Recent Deployment

Latest deployment (2025-08-07):
- **NFT**: `0xD8543363D99314fdE362014CF89CF6b5417d2B68`
- **Metadata**: `0x565B793c191FE9C0D9980eCDB05A1471aBA198b4`
- **Composer**: `0x7B6c09495557C3E3Fa78F899806FB849bd24A933`
- **LegendaryBank**: `0xf6691E452fc377c3ea4975696bD20E3CCe4d686a`

## Checklist

- [ ] Deploy contracts with `deploy-clean.js`
- [ ] Note all contract addresses
- [ ] Update `/frontend/js/web3-integration.js` with NFT address
- [ ] Update `/frontend/config/blockchain.json` with all addresses
- [ ] Test frontend connection
- [ ] Verify metadata loading
- [ ] Test minting functionality
- [ ] Commit and push changes

## Notes

- Always deploy from bottom layer up (Banks → Composer → Metadata → NFT)
- Frontend requires both NFT address (for minting) and Metadata address (for viewing)
- LegendaryBank is referenced by Metadata contract, no frontend update needed
- Keep deployment files for reference and rollback