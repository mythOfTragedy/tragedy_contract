# MonsterMetadataBank コントラクト比較

## 概要

MonsterMetadataBankには3つのバージョンがあります：

1. **MonsterMetadataBank.sol** - オリジナル版（Stack too deepエラーあり）
2. **MonsterMetadataBankV2.sol** - フル機能版（Stack too deep対策済み）✅
3. **MonsterMetadataBankOptimized.sol** - 軽量版（最もシンプル）

## 機能比較

| 機能 | MonsterMetadataBank | MonsterMetadataBankV2 | MonsterMetadataBankOptimized |
|------|---------------------|----------------------|------------------------------|
| 基本属性（4種×10） | ✅ | ✅ | ✅ |
| レジェンダリーID | ✅ 詳細実装 | ✅ 最適化実装 | ✅ シンプル実装 |
| シナジーシステム | ✅ 完全実装 | ✅ mapping実装 | ❌ 簡略版 |
| SVG生成 | ✅ 詳細 | ✅ 中程度 | ✅ シンプル |
| ガス効率 | 低（エラー） | 中 | 高 |
| コード複雑度 | 高 | 中 | 低 |
| コンパイル | ❌ Stack too deep | ✅ 正常 | ✅ 正常 |

## MonsterMetadataBank.sol（フル機能版）

### 特徴
- 完全なシナジーシステム（Quad/Trinity/Dual）
- 30以上のレジェンダリーID定義
- 装備変換機能
- 詳細なSVG生成

### 使用場面
- 複雑なゲームメカニクスが必要な場合
- シナジーによる特別な効果を実装したい場合
- より豊かなメタデータが必要な場合

### 修正内容（Stack too deep対策）
```solidity
// Before: パラメータが多すぎる
function generateDynamicStory(uint8 s, uint8 e, uint8 r, uint8 c, uint256 seed)

// After: パラメータを削減
function generateSimpleDescription(uint8 s, uint8 e, uint8 r, uint8 c)
```

## MonsterMetadataBankOptimized.sol（最適化版）

### 特徴
- シンプルなレアリティ計算
- 最小限のSVG生成
- 関数を分割してスタック使用量を削減
- レジェンダリーIDはmappingで管理

### 使用場面
- ガス効率を重視する場合
- シンプルなNFTコレクションで十分な場合
- テストネットでの検証時

### 最適化テクニック
```solidity
// JSONを2つのパートに分割
function generateJsonPart1(...)
function generateJsonPart2(...)

// シンプルなレアリティ計算
if (s == e) matches++;  // 属性の一致数でレアリティ決定
```

## MonsterMetadataBankV2.sol（推奨版）✅

### 特徴
- フル機能版の全機能を維持
- Stack too deepエラーを完全に解消
- 関数を適切に分割して最適化
- シナジーシステムをmappingで実装

### 最適化テクニック
```solidity
// メタデータ生成を2つのパートに分割
function _buildMetadataPart1(uint256 tokenId)
function _buildMetadataPart2(uint256 tokenId)

// 各機能を独立した関数に分離
function _getNameAndDescription(...)
function _calculateRarity(...)
function _generateSimpleImage(...)
```

## 推奨される使用方法

### 本番環境
```solidity
// フル機能が必要な場合（推奨）
import "./bank/MonsterMetadataBankV2.sol";

// 最小限の機能で良い場合
import "./bank/MonsterMetadataBankOptimized.sol";

// 使用しない（エラーのため）
// import "./bank/MonsterMetadataBank.sol";
```

### 開発・テスト環境
最初は`MonsterMetadataBankOptimized`で開発し、必要に応じて`MonsterMetadataBank`の機能を移植することを推奨します。

## コンパイル設定

Stack too deepエラーが続く場合は、hardhat.config.jsに以下を追加：

```javascript
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true  // Stack too deep対策
    }
  }
};
```

## まとめ

- **開発初期**: `MonsterMetadataBankOptimized`を使用
- **機能追加時**: 必要に応じて`MonsterMetadataBank`の機能を参考に
- **本番環境**: プロジェクトの要件に応じて選択

両方のコントラクトは`IMetadataBank`インターフェースを実装しているため、`BankedNFT`との互換性は保証されています。