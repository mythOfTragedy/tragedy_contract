# Synergy Transformation System Proposal

## 概要
シナジー発動時に、一見普通の装備品（Amulet/Shoulder）が悲劇的なトロフィー（Head/Arm）に変化するシステムの実装提案。

## 背景
現在のシステムでは、シナジーが発動してもアイテムの見た目や名称は変化しない。しかし、DESIGN.mdの隠された意図として、特定のシナジー時には装備品の真の姿が明らかになるという演出が計画されていた。

例：
- **Werewolf + Amulet** → シナジー発動時、お守りが「前のアルファの首」であることが判明
- **Frankenstein + Shoulder** → シナジー発動時、肩鎧が「収集した腕」であることが判明

## 技術的実装案

### 1. 新規アセットの追加
```
contracts/assets/
├── head.svg    # 切断された頭部のSVG（グロテスクな表現）
└── arm.svg     # 切断された腕のSVG（グロテスクな表現）
```

### 2. ItemBankの拡張
```solidity
contract ArweaveItemBankV2 {
    // 既存の10個 + 隠しアイテム2個
    string[12] public itemNames = [
        "Crown", "Sword", "Shield", "Poison", "Torch",
        "Wine", "Scythe", "Shoulder", "Amulet", "Staff",
        "Head",    // ID: 10 (隠しアイテム)
        "Arm"      // ID: 11 (隠しアイテム)
    ];
}
```

### 3. ComposerV5の実装
```solidity
contract ArweaveTragedyComposerV5 {
    function composeSVG(
        uint8 species, 
        uint8 background, 
        uint8 item, 
        uint8 effect,
        bool hasSynergy  // 新規パラメータ
    ) external view returns (string memory) {
        // シナジー時のアイテム変換
        uint8 displayItem = item;
        if (hasSynergy) {
            if (item == 8) { // Amulet → Head
                displayItem = 10;
            } else if (item == 7) { // Shoulder → Arm
                displayItem = 11;
            }
        }
        
        // displayItemを使用してSVGを構築
    }
}
```

### 4. MetadataV5の実装
```solidity
contract TragedyMetadataV5 {
    function generateMetadata(...) public view returns (string memory) {
        // シナジーチェック
        SynergyResult memory synergy = checkSynergies(...);
        
        // アイテム名の動的変更
        string memory displayItemName = itemName;
        if (synergy.found) {
            if (keccak256(bytes(itemName)) == keccak256(bytes("Amulet"))) {
                displayItemName = "Head";
            } else if (keccak256(bytes(itemName)) == keccak256(bytes("Shoulder"))) {
                displayItemName = "Arm";
            }
        }
        
        // Composerを呼び出す際にシナジー情報を渡す
        string memory svg = composer.composeSVG(
            species, background, item, effect, synergy.found
        );
    }
}
```

### 5. 属性名の標準化
現在の属性名を DESIGN.md に準拠させる：
- `Monster` → `Species`（種族）
- `Background` → `Realm`（領域）
- `Item` → `Equipment`（装備）
- `Effect` → `Curse`（呪い）

この変更により：
1. **世界観の統一**: DESIGN.mdで定義された用語と完全に一致
2. **物語性の強化**: 「Monster」より「Species」の方が、生物学的・神話学的な深みを表現
3. **領域の概念**: 「Background」を「Realm」にすることで、単なる背景ではなく、各キャラクターが属する次元や領域を示唆

実装例：
```json
{
  "attributes": [
    {"trait_type": "Species", "value": "Vampire"},
    {"trait_type": "Equipment", "value": "Wine"},
    {"trait_type": "Realm", "value": "Bloodmoon"},
    {"trait_type": "Curse", "value": "Bats"}
  ]
}
```

## 実装による効果

### 1. 物語的深化
- 通常時は無害に見える装備が、シナジー時に恐ろしい真実を明かす
- "Generative Tragedy" のコンセプトを視覚的に表現

### 2. コレクタビリティの向上
- 同じトークンでも、シナジーの有無で異なる表示
- 隠された要素の発見による驚きと満足感

### 3. 技術的革新性
- NFTの動的な変化を実現
- メタデータとビジュアルの連動

## リスクと対策

### リスク
1. ガス代の増加（追加の計算処理）
2. 既存NFTとの互換性
3. グロテスクな表現への反応

### 対策
1. 最適化されたシナジーチェック関数
2. 後方互換性の維持（既存のNFTは変更なし）
3. コミュニティへの事前説明とオプトイン機能

## 実装スケジュール案

1. **Phase 1**: アセット準備とレビュー（1週間）
2. **Phase 2**: スマートコントラクト開発（2週間）
3. **Phase 3**: テストネットでの検証（1週間）
4. **Phase 4**: メインネットデプロイ（1日）

## 6. レアリティシステムの実装

### レアリティ階層
- **Common** (40%)
- **Uncommon** (30%)
- **Rare** (15%)
- **Epic** (10%)
- **Legendary** (5%)
- **Mythic** (Quad Synergy専用)

### レアリティ計算ロジック
```solidity
function calculateRarity(
    uint8 species,
    uint8 equipment,
    uint8 realm,
    uint8 curse,
    uint256 tokenId
) internal pure returns (string memory) {
    // 1. Legendary IDチェック（30個の特別なトークンID）
    if (isLegendaryId(tokenId)) {
        return "Legendary";
    }
    
    // 2. シナジーチェック（最大のものを採用）
    if (hasQuadSynergy(species, equipment, realm, curse)) {
        return "Mythic"; // 最高レアリティ確定
    }
    
    if (hasTripleSynergy(species, equipment, realm, curse)) {
        return "Epic"; // 最低でもEpic
    }
    
    if (hasDualSynergy(species, equipment) || hasDualSynergy(curse, realm)) {
        // Dualシナジーの場合、ベースレアリティから1段階上昇
        uint8 baseLevel = getBaseRarityLevel(tokenId);
        return getRarityName(min(baseLevel + 1, 4)); // 最大Legendary
    }
    
    // 3. ベースレアリティ（確率ベース）
    return getBaseRarity(tokenId);
}

function getBaseRarity(uint256 tokenId) internal pure returns (string memory) {
    uint256 seed = uint256(keccak256(abi.encodePacked(tokenId)));
    uint256 roll = seed % 100;
    
    if (roll < 40) return "Common";      // 40%
    if (roll < 70) return "Uncommon";    // 30%
    if (roll < 85) return "Rare";        // 15%
    if (roll < 95) return "Epic";        // 10%
    return "Legendary";                   // 5%
}
```

### メタデータへの実装
```json
{
  "attributes": [
    {"trait_type": "Species", "value": "Vampire"},
    {"trait_type": "Equipment", "value": "Wine"},
    {"trait_type": "Realm", "value": "Bloodmoon"},
    {"trait_type": "Curse", "value": "Bats"},
    {"trait_type": "Rarity", "value": "Mythic"},
    {"trait_type": "Synergy", "value": "Crimson Lord"}
  ]
}
```

### 実装による効果
1. **価値の可視化**: レアリティが明確に表示され、コレクションの価値が一目で分かる
2. **収集の動機付け**: レアリティの階層がコレクターの収集欲を刺激
3. **マーケットでの差別化**: レアリティによる検索・フィルタリングが可能に

## まとめ
このシナジー変身システムとレアリティシステムは、"The Mythical Cursed-Nightmare" の核心的な価値提案である「隠された悲劇性」を技術的に実現するものです。表面的な美しさの下に潜む恐怖を、動的なNFTシステムで表現することで、真の意味での「生成的悲劇文学」を完成させます。