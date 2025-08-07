# Tragedy NFT - Contract Addresses (Final Clean Version)

## Deployment Date: 2025-08-06
## Network: Bon-Soleil Testnet (Chain ID: 21201)

### Main Contracts

| Contract | Address |
|----------|---------|
| **BankedNFT** | `0x0F11e1B8857C44E279754a096281B0c3B364f6fE` |
| **Metadata** | `0x5143f16dA9bE850da6c11cB50A7359A36e1D349b` |
| **Composer** | `0x04DcC2cB2f77ce1DAf828469c6bD06A448f0BC32` |

### Bank Contracts (Combined)

| Contract | Address |
|----------|---------|
| **MonsterBank** | `0xCB0cAee7b79484F338BCd69e24c680A2C93d0571` |
| **ItemBank** | `0xa5A704834c084cE513E61a6b861729e598A6A7D3` |
| **BackgroundBank** | `0xA985DB7342431267d5a522B771f63775BAA8362a` |
| **EffectBank** | `0x82B93B6C9d923c0D0D77BEbeF70e5F1318C915A9` |

### Individual Bank Contracts (Referenced by Combined Banks)

| Contract | Address |
|----------|---------|
| **MonsterBank1** | `0xdD2B2Cc7822cDb5bB11921173B42BdbC2d14a3d3` |
| **MonsterBank2** | `0xA01850099813fd8eC6c26088B61A2cc7e0860ab8` |
| **ItemBank1** | `0xE193Acd3a7FEbAE044883FfA6b86eab85E4A2dF0` |
| **ItemBank2** | `0x2C5400420a3d4E6bB396bC7B3b993063811f7826` |

## Contract Parameters

### BankedNFT
- **Name**: Tragedy NFT
- **Symbol**: TRAGEDY
- **Max Supply**: 10,000
- **Mint Fee**: 0.01 ETH
- **Royalty Rate**: 2.5% (250 basis points)

## Final Version Improvements
- ✅ Removed V3/V5 version numbers from all contract names
- ✅ Clean naming convention without technical version suffixes
- ✅ Metadata no longer exposes technical filter parameters (Hue Rotation, Saturation, Brightness)
- ✅ **Real Arweave URLs embedded in contracts by default** - No more placeholder URLs!
- ✅ GitHubから取得後すぐに動作する（追加のURL更新不要）
- ✅ Improved user experience with cleaner contract references

## Ready-to-Use Features
- **Backgrounds**: All 10 background effects with actual Arweave URLs
- **Effects**: All 10 visual effects with actual Arweave URLs  
- **No Setup Required**: Deploy and immediately functional
- **Future-Proof**: Anyone cloning from GitHub gets working contracts

## How to Use in Remix

1. Open Remix IDE (https://remix.ethereum.org)
2. Copy the interface files from this directory
3. Compile the interfaces
4. In "Deploy & Run Transactions" tab:
   - Set Environment to "Injected Provider" (MetaMask)
   - Make sure you're connected to Bon-Soleil Testnet
   - Load contract at address using the addresses above