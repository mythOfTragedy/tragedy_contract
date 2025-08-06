# 4層アーキテクチャ設計

## 概要

NFTシステムを4つの明確な層に分離することで、クリーンで拡張性の高いアーキテクチャを実現します。

```
┌─────────────────────────────────────┐
│         Layer 1: NFT Layer          │
│            (BankedNFT)              │
├─────────────────────────────────────┤
│      Layer 2: Metadata Layer        │
│         (MetadataBank)              │
├─────────────────────────────────────┤
│       Layer 3: Composer Layer       │
│    (SVGComposer, TextComposer)      │
├─────────────────────────────────────┤
│       Layer 4: Material Layer       │
│         (MaterialBank)              │
└─────────────────────────────────────┘
```

## 各層の役割

### 🎯 Layer 1: NFT Layer (BankedNFT)
**責務**: NFTの基本機能
- トークンの発行・転送・焼却
- 所有権管理
- ロイヤリティ設定
- MetadataBankへの参照

```solidity
contract BankedNFT is ERC721 {
    IMetadataBank public metadataBank;
    
    function tokenURI(uint256 tokenId) returns (string memory) {
        return metadataBank.getMetadata(tokenId);
    }
}
```

### 📋 Layer 2: Metadata Layer (MetadataBank)
**責務**: メタデータの組み立て
- JSON構造の生成
- 各Composerの呼び出し
- 属性の管理
- Base64エンコーディング

```solidity
contract MetadataBank {
    ISVGComposer svgComposer;
    ITextComposer textComposer;
    
    function getMetadata(uint256 tokenId) returns (string memory) {
        string memory image = svgComposer.composeSVG(...);
        string memory name = textComposer.composeName(...);
        return buildJSON(name, image, ...);
    }
}
```

### 🎨 Layer 3: Composer Layer
**責務**: 各要素の生成・合成
- **SVGComposer**: 画像の合成
- **TextComposer**: テキストの生成
- **AttributeComposer**: 属性の計算
- **RarityComposer**: レアリティ判定

```solidity
contract SVGComposer {
    IMaterialBank materialBank;
    
    function composeSVG(bg, char, item, effect) returns (string memory) {
        string memory bgSVG = materialBank.getMaterial(BACKGROUND, bg);
        string memory charSVG = materialBank.getMaterial(CHARACTER, char);
        return assembleSVG(bgSVG, charSVG, ...);
    }
}
```

### 🗄️ Layer 4: Material Layer (MaterialBank)
**責務**: 素材の保管・提供
- SVGパーツの保存
- テキストテンプレートの保存
- カラーパレットの管理
- 素材のCRUD操作

```solidity
contract MaterialBank {
    mapping(MaterialType => mapping(uint256 => string)) materials;
    
    function getMaterial(MaterialType type, uint256 id) returns (string memory) {
        return materials[type][id];
    }
}
```

## データフローの例

```
1. ユーザーが tokenURI(123) を呼び出し
                ↓
2. BankedNFT が MetadataBank.getMetadata(123) を呼び出し
                ↓
3. MetadataBank が tokenId をデコードして属性を取得
   - species: 5 (Skeleton)
   - equipment: 2 (Shield)
   - realm: 7 (Frost)
   - curse: 1 (Mind Blast)
                ↓
4. MetadataBank が各 Composer を呼び出し
   - SVGComposer.composeSVG(7, 5, 2, 1)
   - TextComposer.composeName(123, 5, 2)
   - TextComposer.composeDescription(5, 2, 7, 1)
                ↓
5. SVGComposer が MaterialBank から素材を取得
   - getMaterial(BACKGROUND, 7) → Frost背景
   - getMaterial(SPECIES, 5) → Skeletonグラフィック
   - getMaterial(EQUIPMENT, 2) → Shield画像
   - getMaterial(EFFECT, 1) → Mind Blastエフェクト
                ↓
6. 各層が結果を上位層に返す
   - MaterialBank → SVGComposer: SVGパーツ
   - SVGComposer → MetadataBank: 合成されたSVG画像
   - MetadataBank → BankedNFT: 完全なJSON metadata
   - BankedNFT → ユーザー: tokenURI
```

## 拡張例

### 新しいComposerの追加
```solidity
// 季節イベント用Composer
contract SeasonalSVGComposer is ISVGComposer {
    function composeSVG(...) returns (string memory) {
        // クリスマス装飾を追加
        string memory baseSVG = super.composeSVG(...);
        return addChristmasDecorations(baseSVG);
    }
}
```

### 新しいMaterialTypeの追加
```solidity
// MaterialBankに新しい素材タイプを追加
enum MaterialType {
    SPECIES,
    EQUIPMENT,
    BACKGROUND,
    EFFECT,
    SEASON,      // 新規：季節素材
    PARTICLE,    // 新規：パーティクルエフェクト
    FRAME        // 新規：フレーム装飾
}
```

### 動的なComposer切り替え
```solidity
contract DynamicMetadataBank is MetadataBank {
    mapping(uint256 => address) public seasonalComposers;
    
    function getMetadata(uint256 tokenId) returns (string memory) {
        // 現在の季節に応じてComposerを切り替え
        ISVGComposer composer = getCurrentSeasonComposer();
        return generateWithComposer(tokenId, composer);
    }
}
```

## メリット

1. **保守性**: 各層が独立しているため、修正が容易
2. **再利用性**: 各層を他のプロジェクトで再利用可能
3. **テスタビリティ**: 各層を個別にテスト可能
4. **拡張性**: 新機能を適切な層に追加するだけ
5. **ガス効率**: 必要な機能のみをロード

## まとめ

この4層構造により：
- **BankedNFT**: NFTの基本機能に専念
- **MetadataBank**: メタデータの組み立てに専念
- **Composer**: 各要素の生成に専念
- **MaterialBank**: 素材の管理に専念

各層が単一の責任を持つことで、システム全体がクリーンで理解しやすくなります。