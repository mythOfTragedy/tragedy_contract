# Remix IDE Interfaces for Tragedy NFT V5

This directory contains interface files for interacting with deployed Tragedy NFT V5 contracts using Remix IDE.

## Files

- **CONTRACT_ADDRESSES.md** - List of all deployed contract addresses
- **IBankedNFT.sol** - Interface for the main NFT contract
- **IMetadataV5.sol** - Interface for metadata generation
- **IComposerV5.sol** - Interface for SVG composition
- **IMonsterBank.sol** - Interface for monster SVG storage
- **IItemBank.sol** - Interface for item SVG storage
- **IBackgroundBank.sol** - Interface for background URL storage
- **IEffectBank.sol** - Interface for effect URL storage

## How to Use

1. **Open Remix IDE**: https://remix.ethereum.org

2. **Create a new workspace** or use existing one

3. **Copy interface files**:
   - Create a new folder called "interfaces" in Remix
   - Copy all `.sol` files from this directory into Remix

4. **Compile the interfaces**:
   - Select Solidity compiler version 0.8.20 or higher
   - Compile all interface files

5. **Connect to Bon-Soleil Testnet**:
   - In "Deploy & Run Transactions" tab
   - Set Environment to "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to Bon-Soleil Testnet (Chain ID: 21201)

6. **Load contracts at address**:
   - Select the interface you want to interact with
   - Click "At Address" button
   - Enter the contract address from CONTRACT_ADDRESSES.md
   - Click the button to load the contract

7. **Interact with contracts**:
   - Use the loaded contract interface to call functions
   - Read functions are free
   - Write functions require gas

## Common Operations

### Check NFT Collection Info
1. Load IBankedNFT at address: `0x96a960FA0c267dc9fa64f61C849d6D0e88801d34`
2. Call: `name()`, `symbol()`, `totalSupply()`, `maxSupply()`, `mintFee()`

### Mint an NFT
1. Load IBankedNFT
2. Send 0.01 ETH with `mint()` function call

### View NFT Metadata
1. Load IBankedNFT
2. Call `tokenURI(tokenId)` with a valid token ID

### Check Material Banks
1. Load IMonsterBank at address: `0xc5dC1c5F923edA5eBe4765fE5A2E10Ae03D8b123`
2. Call `getMonsterName(0)` through `getMonsterName(9)` to see all monsters

## Network Configuration

If you haven't added Bon-Soleil Testnet to MetaMask:
- Network Name: Bon-Soleil Testnet
- RPC URL: https://dev2.bon-soleil.com/rpc
- Chain ID: 21201
- Currency Symbol: ETH