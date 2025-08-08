# Current Deployment Status

## 最新デプロイメント情報 / Latest Deployment

**Date**: 2025-08-07 22:50:50 UTC  
**Network**: Private Chain (RPC_URL/CHAIN_ID from .env)  
**Method**: `npm run deploy:private` (新統一システム)

## デプロイ済みコントラクト / Deployed Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **BankedNFT** | `0x60b5C5f23aab8A6A278209DDD9e5FB5a061e127d` | メインNFTコントラクト |
| **TragedyMetadata** | `0x3aC2D1E9Ae491a87250A67e59358FF27fE4B3C68` | メタデータ生成 |
| **ArweaveTragedyComposer** | `0x1Ef1C96641232671B4eD60efF7Cb58315B7d4BE8` | SVG合成エンジン |
| **LegendaryBank** | `0x4D642Cb0084437A7B989604724280db6552c3276` | レジェンダリー管理 |

### Bank Contracts

| Bank Type | Main Contract | Sub-Contract 1 | Sub-Contract 2 |
|-----------|---------------|----------------|----------------|
| **Monster** | `0x19F418ACAF5f3d763c108e1DC75ECC0667185917` | `0x57825F75d5Bbd9579aD5BaC196D915bBaA63a0A3` | `0x191eD4001eC26d759D0B1eB05b7a36575E63A056` |
| **Item** | `0x25e712dee346ef940d2cC8241C4C14dd39d38D8c` | `0x6B163aa64A5e8b86C498E420A503bB2a73D1fFBF` | `0xf525AC480577e75F51612301A6d823d20b2d612a` |
| **Background** | `0x39FD0A0A12082F2048E70cd3d696b657b8a0A724` | - | - |
| **Effect** | `0xcEBB3c91426FE11aC942E845A57dbFB43850B284` | - | - |

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
- **詳細デプロイログ**: `deployments/bonsoleil-2025-08-07T22-50-52.json`
- **デプロイガイド**: `docs/DEPLOYMENT.md`

## 最近の変更 / Recent Changes

1. **2025-08-07 22:50**: 新統一デプロイシステムで再デプロイ
   - すべてのコントラクトアドレスが更新
   - 自動検証が成功

2. **2025-08-07 16:37**: Burning効果のArweave URLを更新
   - 旧: `https://4xilt2jbun6zo5xus37tjclqofafrntncwxecnnltxclbxtwmuya.arweave.net/...`
   - 新: `https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA`

2. **デプロイスクリプトの整理**:
   - 一時的なスクリプトを`scripts/archive/`に移動
   - 主要なデプロイ方法を`deploy-clean.js`に統一

## 注意事項 / Notes

- **新システム**: `npm run deploy:private`がプライベートチェーンへの推奨デプロイ方法
- **.env設定**: RPC_URL、CHAIN_ID、PRIVATE_KEYを設定することで任意のプライベートチェーンに対応
- **旧システム**: `legacy:`プレフィックス付きコマンドで利用可能
- 複数のデプロイ履歴ファイルが存在する場合、`deployments/current.json`が最新
- フロントエンド（viewer）は自動的に`viewer/deployment.json`を参照
- 移行ガイド: `MIGRATION_GUIDE.md`を参照

---
*Last Updated: 2025-08-07*