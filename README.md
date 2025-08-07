# Tragedy NFT Arweave Hybrid Implementation - 正式構築手順書

## 概要
本手順書は、Arweaveとオンチェーンのハイブリッドアプローチを用いたTragedy NFTシステムの正式な構築手順を記載します。

### アプローチの特徴
1. **背景とエフェクト**: Arweaveに永続保存（大容量画像対応）
2. **モンスターとアイテム**: オンチェーンSVG（完全なオンチェーン）
3. **カラーフィルター**: 背景テーマに応じた色相変換フィルターをSVG内で実装
4. **Base64エンコーディング**: オンチェーンSVGをdata URIとして埋め込み

## 前提条件
- Node.js 16以上
- Hardhat開発環境
- Bon-Soleil Testnetへのアクセス

## プロジェクト構造
```
formal_procedure_p1/
├── README.md                 # 本手順書
├── contracts/
│   ├── libraries/
│   │   └── Base64.sol       # Base64エンコーディングライブラリ
│   ├── ArweaveMonsterBank.sol    # モンスターSVG保存用
│   ├── ArweaveItemBank.sol       # アイテムSVG保存用
│   ├── ArweaveBackgroundBank.sol # 背景Arweave URL管理用
│   ├── ArweaveEffectBank.sol     # エフェクトArweave URL管理用
│   └── ArweaveTragedyComposerV2.sol # SVG合成エンジン
├── scripts/
│   ├── 01-deploy-all.js          # 全コントラクト一括デプロイ
│   ├── 02-update-urls.js         # Arweave URL更新
│   └── 03-test-composition.js    # 動作確認
├── test/
│   └── ArweaveComposer.test.js   # ユニットテスト
└── viewer/
    └── index.html                # ブラウザ確認用
```

## Step 1: プロジェクトセットアップ

### 1.1 Hardhatプロジェクトの初期化
```bash
cd formal_procedure_p1
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers ethers chai
npx hardhat init
```

### 1.2 hardhat.config.jsの設定
```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      },
      viaIR: true
    }
  },
  networks: {
    bonsoleil: {
      url: "https://dev2.bon-soleil.com/rpc",
      chainId: 21201,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
```

### 1.3 環境変数の設定
`.env`ファイルを作成：
```
PRIVATE_KEY=your_private_key_here
```

## Step 2: コントラクトの実装

### 2.1 Base64ライブラリ
`contracts/libraries/Base64.sol`を作成（後述のファイル参照）

### 2.2 Bank系コントラクト
以下のコントラクトを作成：
- `ArweaveMonsterBank.sol`: モンスターSVGをオンチェーンで保存
- `ArweaveItemBank.sol`: アイテムSVGをオンチェーンで保存
- `ArweaveBackgroundBank.sol`: 背景のArweave URLを管理
- `ArweaveEffectBank.sol`: エフェクトのArweave URLを管理

### 2.3 Composerコントラクト
`ArweaveTragedyComposerV2.sol`を作成
- 各Bankからデータを取得
- SVGフィルターを生成
- 最終的なSVGを合成

## Step 3: デプロイ

### 3.1 コンパイル
```bash
npx hardhat compile
```

### 3.2 デプロイスクリプトの実行
```bash
npx hardhat run scripts/01-deploy-all.js --network bonsoleil
```

### 3.3 Arweave URLの更新
```bash
npx hardhat run scripts/02-update-urls.js --network bonsoleil
```

## Step 4: 動作確認

### 4.1 コントラクトテスト
```bash
npx hardhat test
```

### 4.2 ブラウザでの確認
1. `viewer/index.html`をブラウザで開く
2. 各パラメータを選択
3. SVGが正しく表示されることを確認

## 技術詳細

### カラーフィルターの仕組み
各背景テーマに対して以下のフィルターパラメータを適用：
- **hueRotate**: 色相回転（0-360度）
- **saturate**: 彩度調整（1.0 = 100%）
- **brightness**: 明度調整（1.0 = 100%）

例：
- Venom（毒）: 緑色強調（hue=120, sat=1.8, bright=1.1）
- Frost（霜）: 青色強調（hue=200, sat=1.4, bright=1.2）
- Bloodmoon（血月）: 赤色強調（hue=0, sat=1.5, bright=1.2）

### SVG構造
```xml
<svg>
  <defs>
    <filter id="f0">
      <feColorMatrix type="hueRotate" values="120"/>
      <feColorMatrix type="saturate" values="1.80"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.10"/>
        <feFuncG type="linear" slope="1.10"/>
        <feFuncB type="linear" slope="1.10"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <image href="[Arweave URL]" x="0" y="0" width="24" height="24"/>
  <image href="[Base64 Monster]" filter="url(#f0)"/>
  <image href="[Base64 Item]"/>
  <image href="[Arweave Effect URL]"/>
</svg>
```

## トラブルシューティング

### Q: Base64エンコードが不正になる
A: SVG全体をエンコードしているか確認。`extractSVGContent`関数を使用しない。

### Q: フィルターが適用されない
A: `<defs>`タグ内にフィルター定義があることを確認。

### Q: Arweave画像が表示されない
A: CORS設定とURLの正しさを確認。

## 次のステップ
1. NFTコントラクトの実装（ERC721）
2. メタデータ生成機能の追加
3. ミント機能の実装
4. フロントエンドの構築