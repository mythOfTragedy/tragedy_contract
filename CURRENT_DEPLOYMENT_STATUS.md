# Current Deployment Status

## 最新デプロイメント情報 / Latest Deployment

**Date**: 2025-08-07 16:37:34 UTC  
**Network**: Bon-Soleil Testnet  
**Method**: `deploy-clean.js`

## デプロイ済みコントラクト / Deployed Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **BankedNFT** | `0xB4d1326e49fb178c16C045026500472D7DE51D42` | メインNFTコントラクト |
| **TragedyMetadata** | `0x3eEb602E0Ed94678e8C575647394286cB1B7d023` | メタデータ生成 |
| **ArweaveTragedyComposer** | `0xF8a03Eb8f24374575f6d55D581DaE9F914866E7d` | SVG合成エンジン |
| **LegendaryBank** | `0x98649Db0170d6E757aF9aFd9E63CCdaaa9E241de` | レジェンダリー管理 |

### Bank Contracts

| Bank Type | Main Contract | Sub-Contract 1 | Sub-Contract 2 |
|-----------|---------------|----------------|----------------|
| **Monster** | `0xEa525df7A7983c79F9Ff87Bc45Bc4ace5d4b754B` | `0x57C13Ad558d75AE16C0EAaeB6f0dA07f7Ac2108b` | `0xe235907cDbA611506A8dc01681Ee34760B1a0C17` |
| **Item** | `0x4Ff085Ed36601d412A75030f47c4ffD807851c44` | `0x22F82f81E3845E1c375C32c304407D3E68FD3C2A` | `0xB44c571246a8DF8C5142A2DBd5f63b628a1062e6` |
| **Background** | `0x7C52655d2e5FbDdB2cB38ad10D55e3c938543587` | - | - |
| **Effect** | `0x0566b56Df99bF6577484e1Bd721348213Acf51eb` | - | - |

## 重要な設定 / Key Configuration

- **Max Supply**: 10,000 NFTs
- **Mint Fee**: 0.01 ETH  
- **Royalty Rate**: 2.5% (250 basis points)
- **SHUFFLE_SEED**: 4567
- **Legendary Token #1687**: Soul Harvester (Monster=9, Item=6, Background=9, Effect=3)
- **Legendary Token #2097**: Toxic Abomination (Monster=2, Item=3, Background=4, Effect=3)

## デプロイ方法 / Deployment Method

現在推奨されるデプロイ方法:
```bash
npx hardhat run scripts/deploy-clean.js --network bonsoleil
```

または:
```bash
./deploy.sh bonsoleil --with-nft
```

## ファイル構成 / File Structure

- **メインデプロイ情報**: `viewer/deployment.json`
- **詳細デプロイログ**: `deployments/clean-bonsoleil-1754584655554.json`
- **デプロイガイド**: `docs/DEPLOYMENT.md`

## 最近の変更 / Recent Changes

1. **2025-08-07**: Burning効果のArweave URLを更新
   - 旧: `https://4xilt2jbun6zo5xus37tjclqofafrntncwxecnnltxclbxtwmuya.arweave.net/...`
   - 新: `https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA`

2. **デプロイスクリプトの整理**:
   - 一時的なスクリプトを`scripts/archive/`に移動
   - 主要なデプロイ方法を`deploy-clean.js`に統一

## 注意事項 / Notes

- `deploy-production.js`と`01-deploy-all.js`も存在するが、`deploy-clean.js`が最新かつ推奨
- 複数のデプロイ履歴ファイルが存在する場合、タイムスタンプで最新を確認
- フロントエンド（viewer）は自動的に`viewer/deployment.json`を参照

---
*Last Updated: 2025-08-07*