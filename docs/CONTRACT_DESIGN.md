# NFTコントラクト設計書

## 目次
1. [システム概要](#システム概要)
2. [コントラクト構成](#コントラクト構成)
3. [詳細設計](#詳細設計)
4. [デプロイメント戦略](#デプロイメント戦略)
5. [セキュリティ考慮事項](#セキュリティ考慮事項)

---

## システム概要

### プロジェクト目的
完全オンチェーンのジェネラティブNFTシステムを構築し、メタデータとビジュアルの両方をスマートコントラクト内で生成・管理する。

### 主要機能
- **ジェネラティブ生成**: 4スロット×10種類の組み合わせ（10,000通り）
- **完全オンチェーン**: メタデータとSVG画像をコントラクト内で生成
- **動的進化**: MetadataBankの切り替えによる見た目の変化
- **シナジーシステム**: 特定の組み合わせで特別な効果

---

## コントラクト構成

### 1. 基本NFTコントラクト

#### **SimpleNFT.sol**
```
用途: 基本的なNFT機能を提供
特徴:
- mint/burn/transfer
- SoulBound対応
- ロイヤリティ機能（ERC2981）
- 設定可能なmintFeeとmaxSupply
```

#### **BankedNFT.sol**
```
用途: MetadataBankと連携するNFT
特徴:
- MetadataBank参照によるtokenURI生成
- mint()とairdrop()機能
- SoulBound対応
- オーナー管理機能
```

### 2. メタデータ管理コントラクト

#### **MetadataBank.sol**
```
用途: 動的にメタデータを管理
特徴:
- メタデータの追加/更新/削除
- 認証されたコントラクトのみアクセス可
- 複数のメタデータURIを管理
```

#### **SimpleMetadataBank.sol**
```
用途: デプロイ時固定のメタデータ管理
特徴:
- コンストラクタで全メタデータを設定
- イミュータブル（変更不可）
- ガス効率的
```

#### **HardcodedMetadataBank.sol**
```
用途: コード内にメタデータを直接記述
特徴:
- デプロイが最も簡単
- メタデータ変更は再デプロイが必要
- 最小ガスコスト
```

### 3. 完全オンチェーンコントラクト

#### **OnchainMetadataNFT.sol**
```
用途: JSONメタデータをオンチェーン生成
特徴:
- Base64エンコードされたdata URI
- 動的属性生成
- 外部ストレージ不要
```

#### **FullyOnchainNFT.sol**
```
用途: SVG画像もオンチェーンで生成
特徴:
- SVGを動的生成
- メタデータも完全オンチェーン
- 真の永続性
```

#### **MonsterGeneratorNFT.sol**
```
用途: Monster NFTのロジックを実装
特徴:
- 4スロット属性システム
- シナジー検出
- レジェンダリーID対応
```

#### **NumericGeneratorNFT.sol**
```
用途: 4桁数値による効率的な管理
特徴:
- 0000-9999の数値コード
- 3つの生成モード（順番/ランダム/事前定義）
- 特別な組み合わせ対応
```

### 4. 進化システム

#### **EvolvableNFT.sol**
```
用途: 時間経過で進化するNFT
特徴:
- MetadataBank切り替えによる進化
- ステージ管理
- スケジュール機能
```

---

## 詳細設計

### データ構造

#### 4桁コードシステム
```solidity
// 各桁の意味
第1桁 (0-9): Species/Character Type
第2桁 (0-9): Equipment/Item
第3桁 (0-9): Realm/Background
第4桁 (0-9): Curse/Effect

// 例
0000 = Dragon + Sword + Fire + Burning
9999 = Phoenix + Orb + Space + Tiny
```

#### 属性マッピング
```solidity
mapping(uint256 => uint16) tokenCode;     // tokenId → 4桁コード
mapping(uint16 => string) specialNames;   // 特別な組み合わせ
mapping(uint256 => bool) soulBoundTokens; // SBT管理
```

### 生成アルゴリズム

#### 1. Sequential Generation
```solidity
function generateSequential() {
    code = currentCode++;
    if (currentCode > 9999) currentCode = 0;
}
```

#### 2. Random Generation
```solidity
function generateRandom(tokenId) {
    seed = keccak256(tokenId, block.timestamp, msg.sender);
    code = seed % 10000;
}
```

#### 3. Predefined Generation
```solidity
function generatePredefined() {
    code = predefinedCodes[index++];
}
```

### メタデータ生成

#### JSONフォーマット
```json
{
  "name": "Monster #1",
  "description": "Fully on-chain generative NFT",
  "image": "data:image/svg+xml;base64,...",
  "attributes": [
    {"trait_type": "Species", "value": "Dragon"},
    {"trait_type": "Equipment", "value": "Sword"},
    {"trait_type": "Realm", "value": "Fire"},
    {"trait_type": "Curse", "value": "Burning"},
    {"trait_type": "Rarity", "value": "Legendary"}
  ]
}
```

#### SVG生成パターン
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <!-- Background -->
  <rect width="400" height="400" fill="{realmColor}"/>
  
  <!-- Character -->
  <g id="character">{characterSVG}</g>
  
  <!-- Equipment -->
  <g id="equipment">{equipmentSVG}</g>
  
  <!-- Effect Overlay -->
  <g id="effect" opacity="0.6">{effectSVG}</g>
</svg>
```

---

## デプロイメント戦略

### Phase 1: 基本機能（推奨開始点）
```
1. SimpleNFT.sol をデプロイ
2. 基本的なmint/transfer機能をテスト
3. OpenSeaなどでの表示確認
```

### Phase 2: メタデータ管理
```
1. SimpleMetadataBank.sol をデプロイ
2. BankedNFT.sol をデプロイ
3. MetadataBankを設定して連携テスト
```

### Phase 3: 完全オンチェーン化
```
1. NumericGeneratorNFT.sol をデプロイ
2. SVG生成ロジックの実装
3. ガスコストの最適化
```

### Phase 4: 進化システム
```
1. 複数のMetadataBankを準備
2. EvolvableNFT.sol をデプロイ
3. 時間ベースの進化テスト
```

### ガスコスト見積もり

| 操作 | 推定ガス | コスト（@30 gwei） |
|------|----------|-------------------|
| SimpleNFT mint | 150,000 | 0.0045 ETH |
| BankedNFT mint | 180,000 | 0.0054 ETH |
| OnchainMetadata tokenURI | 500,000 | 0.015 ETH |
| FullyOnchain tokenURI | 1,000,000 | 0.03 ETH |
| NumericGenerator mint | 200,000 | 0.006 ETH |

---

## セキュリティ考慮事項

### 1. アクセス制御
- **onlyOwner修飾子**: 管理機能の保護
- **認証システム**: MetadataBankへのアクセス制御
- **転送制限**: SoulBoundトークンの実装

### 2. 再入攻撃対策
- **Check-Effects-Interactions**: パターンの遵守
- **ReentrancyGuard**: 必要に応じて実装
- **Pull over Push**: 返金処理の実装

### 3. オーバーフロー対策
- **Solidity 0.8.x**: 自動オーバーフローチェック
- **SafeMath**: 不要（0.8.x以降）

### 4. フロントランニング対策
- **コミット・リビール**: レアリティ生成時
- **ブロックタイムスタンプ**: 最小限の使用

### 5. ストレージ最適化
- **Packing**: 構造体メンバーの最適配置
- **Immutable**: 変更不要な変数
- **Memory vs Storage**: 適切な使い分け

---

## 実装優先順位

### Must Have（必須）
1. ✅ 基本的なNFT機能（mint/transfer/burn）
2. ✅ メタデータ生成
3. ✅ 4桁コードシステム
4. ✅ オーナー管理機能

### Should Have（推奨）
1. ✅ SoulBoundトークン
2. ✅ MetadataBank連携
3. ✅ SVG生成
4. ⬜ シナジーシステム（完全版）

### Nice to Have（あれば良い）
1. ⬜ 進化システム
2. ⬜ 複雑なピクセルアート生成
3. ⬜ オンチェーンゲーム要素
4. ⬜ DAOガバナンス

---

## 使用技術スタック

### スマートコントラクト
- Solidity 0.8.20
- OpenZeppelin Contracts v4.9.0
- ERC721Enumerable
- ERC2981 (Royalty Standard)

### 開発ツール
- Hardhat / Foundry
- Ethers.js / Web3.js
- IPFS（オプション）

### テスト環境
- Sepolia Testnet
- Bon Soleil Testnet (chainId: 21201)
- Local Hardhat Network

---

## 今後の拡張可能性

### 1. クロスチェーン対応
- Layer 2展開（Polygon, Arbitrum）
- ブリッジ機能

### 2. GameFi要素
- ステーキング機能
- バトルシステム
- 経験値/レベルアップ

### 3. コミュニティ機能
- DAO投票
- コミュニティ進化イベント
- 協力プレイ要素

### 4. 経済システム
- トークンエコノミー
- マーケットプレイス
- レンタル機能

---

## お問い合わせ

開発に関する質問や提案は、プロジェクトのGitHubリポジトリまでお願いします。