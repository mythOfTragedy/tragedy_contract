# MonsterMetadataBank 仕様書

## 概要

MonsterMetadataBankは、JavaScriptベースのMonster NFT生成システムをSolidityで実装したものです。10,000体のユニークなモンスターに対して、動的な属性、シナジー、レアリティ計算を含む、完全オンチェーンのメタデータ生成を提供します。

## システムアーキテクチャ

### トークンIDマッピング
- **トークンID**: 0-9999
- **属性エンコーディング**: トークンIDに基づく決定論的な疑似ランダム生成
- 各トークンは10個のオプションから選択される4つの属性を持つ (10^4 = 10,000通りの組み合わせ)

### 属性

1. **種族 (Species)** (10種類):
   - Werewolf（人狼）, Goblin（ゴブリン）, Frankenstein（フランケンシュタイン）, Demon（悪魔）, Dragon（ドラゴン）
   - Zombie（ゾンビ）, Vampire（吸血鬼）, Mummy（ミイラ）, Succubus（サキュバス）, Skeleton（スケルトン）

2. **装備 (Equipment)** (10種類):
   - Crown（王冠）, Sword（剣）, Shield（盾）, Poison（毒）, Torch（松明）
   - Wine（ワイン）, Scythe（大鎌）, Magic Wand（魔法の杖）, Shoulder Armor（肩当て）, Amulet（アミュレット）

3. **領域 (Realm)** (10種類):
   - Bloodmoon（血月）, Abyss（深淵）, Decay（腐敗）, Corruption（堕落）, Venom（猛毒）
   - Void（虚無）, Inferno（業火）, Frost（凍土）, Ragnarok（終末）, Shadow（影）

4. **呪い (Curse)** (10種類):
   - Seizure（発作）, Mind Blast（精神破壊）, Confusion（混乱）, Meteor（隕石）, Bats（蝙蝠）
   - Poisoning（毒化）, Lightning（雷撃）, Blizzard（吹雪）, Burning（燃焼）, Brain Wash（洗脳）

### シナジーシステム

コントラクトは3段階のシナジーを実装します：

1. **クアッドシナジー** (4つの属性が一致)
   - レアリティ: Mythic（神話級）
   - 例: Dragon + Crown + Ragnarok + Meteor = "Cosmic Sovereign"（宇宙の覇者）

2. **トリニティシナジー** (3つの属性が一致)
   - レアリティ: Epic/Legendary（エピック/レジェンダリー）
   - 種族に依存しない組み合わせをサポート
   - 例: Vampire + Wine + Bats = "Classic Nosferatu"（古典的ノスフェラトゥ）

3. **デュアルシナジー** (2つの属性が一致)
   - レアリティ: Rare/Epic/Legendary（レア/エピック/レジェンダリー）
   - カテゴリー: Species+Equipment, Curse+Realm
   - 例: Vampire + Wine = "Blood Sommelier"（血のソムリエ）

### 特別機能

1. **レジェンダリーID**: カスタムタイトルとストーリーを持つ特定のトークンID
   - 例: #1 "The Genesis"（起源）, #666 "The Beast Awakened"（覚醒せし獣）, #777 "Lucky Seven"（ラッキーセブン）

2. **装備変換**: 一部の装備はシナジーのために変換可能
   - Shoulder Armor（肩当て） → Arm（腕）
   - Amulet（アミュレット） → Head（頭）

3. **動的レアリティ**: シナジーとベースシード計算に基づく
   - Common（コモン）, Uncommon（アンコモン）, Rare（レア）, Epic（エピック）, Legendary（レジェンダリー）, Mythic（神話級）

## コントラクト実装

### MonsterMetadataBank.sol

```solidity
contract MonsterMetadataBank is IMetadataBank {
    // コア関数
    function getMetadata(uint256 tokenId) external view returns (string memory);
    function decodeTokenId(uint256 tokenId) public pure returns (uint8 s, uint8 e, uint8 r, uint8 c);
    function previewToken(uint256 tokenId) external view returns (...);
}
```

### 主要関数

1. **getMetadata(tokenId)**: 完全なJSONメタデータを返す
   - 名前（シナジー/レジェンダリーステータスに基づく動的生成）
   - 説明（ストーリーテキスト）
   - SVG画像（簡略化された表現）
   - 属性配列
   - 外部URL

2. **decodeTokenId(tokenId)**: トークンIDを属性インデックスに変換
   - 決定論的な疑似ランダム生成を使用
   - 各トークンに対して一貫した属性を保証

3. **checkSynergies()**: 属性の組み合わせをシナジーとして評価
   - 3つのシナジー段階すべてをチェック
   - シナジーデータとタイプを返す

## 統合例

### MonsterBankedNFT.sol

```solidity
contract MonsterBankedNFT is BankedNFT {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.01 ether;
    
    // ミント関数
    function mint(uint256 tokenId) external payable;
    function mintRandom() external payable returns (uint256);
    function batchMint(uint256 startId, uint256 count) external payable;
}
```

### 機能
- 特定のトークンIDでのミント
- 利用可能性チェック付きランダムミント
- バッチミントサポート
- レジェンダリーIDの特別価格設定
- ミント前のプレビュー機能

## デプロイガイド

1. **MonsterMetadataBankをデプロイ**:
```solidity
MonsterMetadataBank metadataBank = new MonsterMetadataBank();
```

2. **MonsterBankedNFTをデプロイ**:
```solidity
MonsterBankedNFT nft = new MonsterBankedNFT(address(metadataBank));
```

3. **レジェンダリー価格を設定** (オプション):
```solidity
nft.setLegendaryPrice(666, 0.666 ether);
nft.setLegendaryPrice(1337, 0.1337 ether);
```

## ガス最適化戦略

1. **パック構造体**: シナジーデータにuint8を使用
2. **文字列配列**: 事前定義された属性名
3. **決定論的生成**: 個々のトークンにストレージ不要
4. **簡略化されたSVG**: 複雑なグラフィックスの代わりに基本図形を使用

## JavaScriptシステムとの比較

| 機能 | JavaScript | Solidity |
|------|------------|----------|
| 属性 | ✅ 完全 | ✅ 完全 |
| シナジー | ✅ 全タイプ | ✅ 全タイプ |
| レジェンダリーID | ✅ 30以上のID | ✅ 主要ID（拡張可能） |
| SVG生成 | ✅ 複雑 | ⚠️ 簡略化 |
| 動的ストーリー | ✅ 高度 | ⚠️ 基本テンプレート |
| ガスコスト | N/A | 読み取りあたり約200k-400k |

## 将来の拡張

1. **SVG最適化**: SVGコンポーネントを個別に保存
2. **ストーリーテンプレート**: より動的なストーリー生成
3. **追加シナジー**: JSからすべてのシナジーを移植
4. **属性拡張**: 将来の属性をサポート
5. **クロスコントラクト統合**: 他のMetadataBankとの連携

## セキュリティ考慮事項

1. **不変属性**: ミント後のトークン属性は変更不可
2. **オーナー制御**: 価格設定とバンク更新に限定
3. **ランダム性なし**: 決定論的生成により操作を防止
4. **ビュー関数**: すべてのメタデータ読み取りはユーザーにとってガス無料

## メタデータ出力例

```json
{
  "name": "Crimson Lord #6540",
  "description": "血月の下、深紅の支配者は蝙蝠の軍団を指揮する。最も純粋な形の古代吸血鬼の主。",
  "image": "data:image/svg+xml;base64,...",
  "external_url": "https://cursed-nightmare.example.com/essay/6540",
  "attributes": [
    {"trait_type": "種族", "value": "Vampire"},
    {"trait_type": "装備", "value": "Wine"},
    {"trait_type": "領域", "value": "Bloodmoon"},
    {"trait_type": "呪い", "value": "Bats"},
    {"trait_type": "レアリティ", "value": "Mythic"},
    {"trait_type": "シナジータイプ", "value": "Quad"},
    {"trait_type": "シナジー", "value": "Crimson Lord"}
  ]
}
```

## テスト

1. **ミント前のトークンプレビュー**:
```solidity
(string memory species, , , , string memory rarity, bool hasSynergy, ) = nft.previewToken(6540);
```

2. **レジェンダリーの利用可能性チェック**:
```solidity
(uint256[] memory ids, bool[] memory minted, uint256[] memory prices) = nft.getLegendaryTokens();
```

3. **メタデータの検証**:
```solidity
string memory uri = nft.tokenURI(tokenId);
// base64をデコードしてJSON構造を検証
```