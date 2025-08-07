# Tragedy NFT デプロイメントガイド

> **注意**: このドキュメントは技術的な詳細を含みます。最新のデプロイ手順については [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を参照してください。

## 概要
Tragedy NFTシステムの完全なデプロイ手順書。4層構造の下から順番にデプロイします。

## システム構成
```
Layer 4: NFT Contract (BankedNFT)
         ↓
Layer 3: Metadata Contract (TragedyMetadata) 
         ↓
Layer 2: Composer Contract (ArweaveTragedyComposer)
         ↓
Layer 1: Bank Contracts (Monster, Item, Background, Effect)
```

## デプロイ手順

### 1. Individual Banks（最下層）をデプロイ
```bash
# Monster個別バンク
ArweaveMonsterBank1.sol → デプロイ（引数なし）
ArweaveMonsterBank2.sol → デプロイ（引数なし）

# Item個別バンク  
ArweaveItemBank1.sol → デプロイ（引数なし）
ArweaveItemBank2.sol → デプロイ（引数なし）
```

### 2. Main Banksをデプロイ
```bash
# Monster統合バンク（個別バンクのアドレスを引数に）
ArweaveMonsterBank.sol → デプロイ(monsterBank1.address, monsterBank2.address)

# Item統合バンク（個別バンクのアドレスを引数に）
ArweaveItemBank.sol → デプロイ(itemBank1.address, itemBank2.address)

# Background/Effectバンク（引数なし）
ArweaveBackgroundBank.sol → デプロイ（引数なし）
ArweaveEffectBank.sol → デプロイ（引数なし）
```

### 3. Composerをデプロイ
```bash
ArweaveTragedyComposer.sol → デプロイ(
    monsterBank.address,
    backgroundBank.address,
    itemBank.address,
    effectBank.address
)
```

### 4. Metadataをデプロイ
```bash
TragedyMetadata.sol → デプロイ(composer.address)
```

### 5. NFTをデプロイ
```bash
BankedNFT.sol → デプロイ(
    "Tragedy NFT",     // name
    "TRAGEDY",         // symbol
    10000,             // maxSupply
    0.01 ether,        // mintFee
    250                // royaltyRate (2.5%)
)

# デプロイ後、MetadataBankを設定
nft.setMetadataBank(metadata.address)
```

## コントラクト詳細

### TragedyMetadata.sol
- **SHUFFLE_SEED**: 4567（LCGベースの一意なトークンID生成）
- **レジェンダリー位置**:
  - Soul Harvester: #1687
  - Toxic Abomination: #2097
- 両レジェンダリーともeffect=3を使用

### Bank契約の名前順序（重要！）
```solidity
// Monster (0-9)
0: Werewolf
1: Goblin  
2: Frankenstein
3: Demon
4: Dragon
5: Zombie
6: Vampire
7: Mummy
8: Succubus
9: Skeleton

// Item (0-9)
0: Crown
1: Sword
2: Shield
3: Poison
4: Torch
5: Wine
6: Scythe
7: Staff
8: Shoulder
9: Amulet

// Background (0-9)
0: Bloodmoon
1: Abyss
2: Decay
3: Corruption
4: Venom
5: Void
6: Inferno
7: Frost
8: Ragnarok
9: Shadow

// Effect (0-9)
0: Seizure
1: Mindblast
2: Confusion
3: Meteor
4: Bats
5: Poisoning
6: Lightning
7: Blizzard
8: Burning
9: Brainwash
```

## 検証方法

### 1. トークン#1の確認
```javascript
// Expected result:
Species: 0 (Werewolf)
Background: 0 (Bloodmoon)
Item: 0 (Crown)
Effect: 1 (Mindblast)
```

### 2. レジェンダリーの確認
```javascript
// Token #1687 - Soul Harvester
Species: 9 (Skeleton)
Item: 6 (Scythe)
Background: 9 (Shadow)
Effect: 10 (Blackout - transformed from 3)

// Token #2097 - Toxic Abomination
Species: 2 (Frankenstein)
Item: 3 (Poison)
Background: 4 (Venom)
Effect: 11 (Matrix - transformed from 3)
```

## コマンド例（Hardhat）

```bash
# コンパイル
npx hardhat compile

# デプロイ（Bon-Soleil testnet）
npx hardhat run scripts/deploy-clean.js --network bonsoleil

# 検証
npx hardhat run scripts/verify-deployment.js --network bonsoleil
```

## トラブルシューティング

### Q: トークンの属性が期待と異なる
A: Bank契約の名前順序が正しいか確認。特にMonster/Item/Background/Effectの0-9の順番。

### Q: レジェンダリーが重複する
A: SHUFFLE_SEEDが4567になっているか確認。他のseedでは重複が発生する可能性あり。

### Q: デプロイが失敗する
A: 
1. 依存関係の順序を確認（下層から上層へ）
2. コンストラクタ引数が正しいか確認
3. ガス残高が十分か確認

## 更新履歴
- 2025-01-04: LCGベースのトークンマッピングに変更（重複問題解決）
- 2025-01-04: SHUFFLE_SEED=4567で完璧な分布を実現