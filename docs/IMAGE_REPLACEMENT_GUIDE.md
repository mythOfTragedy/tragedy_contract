# Tragedy NFT - 画像差し替えガイド

## 概要

Tragedy NFTシステムは**モジュラー設計**を採用しているため、画像アセットの差し替えが容易に行えます。NFTコントラクト本体（BankedNFT）やメタデータ生成ロジック（TragedyMetadata）を変更することなく、画像のみを更新できます。

## アーキテクチャの特徴

### 画像の保存場所
1. **オンチェーンSVG**
   - Monster（モンスター）: SVGデータを直接コントラクトに保存
   - Item（アイテム）: SVGデータを直接コントラクトに保存

2. **Arweave URL**
   - Background（背景）: 大きな画像ファイルのURLを保存
   - Effect（エフェクト）: アニメーションファイルのURLを保存

### 動的生成の仕組み
- すべての画像は`tokenURI`呼び出し時に動的に生成される
- 既存のNFTも、Bankコントラクトの更新により自動的に新しい画像で表示される

## 画像差し替え手順

### 方法1: Arweave URLの更新（Background/Effect）

最も簡単な方法。既存のBankコントラクトのURLを更新します。

#### 1. 新しい画像をArweaveにアップロード
```bash
# Arweaveへのアップロード（arweave-deployツール等を使用）
arweave deploy-dir ./new-backgrounds --key-file wallet.json
```

#### 2. URLを更新するスクリプトを実行
```javascript
// scripts/update-background-urls.js
const backgroundBank = await ethers.getContractAt(
  "ArweaveBackgroundBank",
  "0xD5A2F6AFaf4d4e08B8e94667D44F8C4721a344f3"
);

const newUrls = [
  "https://arweave.net/新しいURL1",
  "https://arweave.net/新しいURL2",
  // ... 10個のURL
];

const tx = await backgroundBank.batchSetUrls(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  newUrls
);
await tx.wait();
```

### 方法2: 新しいBankコントラクトのデプロイ（Monster/Item）

オンチェーンSVGの場合、新しいコントラクトをデプロイする必要があります。

#### 1. 新しいSVGアセットを準備
```
assets/
├── new-monsters/
│   ├── 0_werewolf.svg
│   ├── 1_vampire.svg
│   └── ...
└── new-items/
    ├── 0_crown.svg
    ├── 1_sword.svg
    └── ...
```

#### 2. Bankコントラクトを生成
```bash
# SVGからBankコントラクトを生成
npx hardhat run scripts/generate-split-banks.js
```

#### 3. 新しいBankをデプロイ
```javascript
// scripts/deploy-new-monster-bank.js
async function main() {
  // Bank1とBank2をデプロイ
  const MonsterBank1 = await ethers.getContractFactory("NewMonsterBank1");
  const bank1 = await MonsterBank1.deploy();
  
  const MonsterBank2 = await ethers.getContractFactory("NewMonsterBank2");
  const bank2 = await MonsterBank2.deploy();
  
  // メインBankをデプロイ
  const MonsterBank = await ethers.getContractFactory("ArweaveMonsterBank");
  const mainBank = await MonsterBank.deploy(bank1.address, bank2.address);
  
  console.log("New MonsterBank deployed to:", mainBank.address);
}
```

#### 4. Composerを更新
```javascript
// scripts/update-composer.js
async function main() {
  // 新しいComposerをデプロイ
  const Composer = await ethers.getContractFactory("ArweaveTragedyComposer");
  const newComposer = await Composer.deploy(
    "0x新しいMonsterBankアドレス",
    "0x既存のItemBankアドレス",
    "0x既存のBackgroundBankアドレス",
    "0x既存のEffectBankアドレス"
  );
  
  // MetadataコントラクトのComposerを更新
  const metadata = await ethers.getContractAt("TragedyMetadata", "0x...");
  await metadata.setComposer(newComposer.address);
}
```

### 方法3: 部分的な画像の差し替え

特定の画像のみを差し替えたい場合。

#### 例: モンスター#3（ゴースト）のみを変更
```solidity
// contracts/banks/CustomMonsterBank2.sol
contract CustomMonsterBank2 is IMonsterBank {
    function getMonsterSVG(uint8 monsterId) external pure returns (string memory) {
        if (monsterId == 7) {  // Ghost
            return '<svg><!-- 新しいゴーストのSVG --></svg>';
        } else if (monsterId == 8) {
            return ArweaveMonsterBank2.getMonsterSVG(monsterId);
        }
        // ...
    }
}
```

## 推奨ワークフロー

### 開発環境でのテスト
1. ローカルネットワークで新しいBankをデプロイ
2. Viewerで表示確認
3. 問題がなければ本番環境へ

### 本番環境での更新
1. **段階的移行を推奨**
   - 新旧両方のComposerを並行運用
   - 問題がないことを確認後、完全移行

2. **ガス代の考慮**
   - URL更新: 約0.01 ETH
   - 新規Bank deploy: 約0.1-0.2 ETH
   - Composer deploy: 約0.05 ETH

## チェックリスト

### URL更新の場合
- [ ] 新しい画像をArweaveにアップロード
- [ ] ArweaveのURLが正しくアクセスできることを確認
- [ ] テストネットでURL更新をテスト
- [ ] 本番環境でURL更新を実行
- [ ] Viewerで表示を確認

### 新規Bankデプロイの場合
- [ ] SVGアセットを準備
- [ ] Bankコントラクトを生成
- [ ] ローカルでデプロイとテスト
- [ ] 新しいComposerをデプロイ
- [ ] Metadataコントラクトを更新
- [ ] 既存NFTの表示を確認
- [ ] 新規ミントのテスト

## トラブルシューティング

### 画像が表示されない
1. ブラウザのコンソールでエラーを確認
2. Arweave URLが正しいか確認
3. CORSエラーの場合は、Arweaveゲートウェイを変更

### ガス代が高すぎる
1. SVGを最適化（不要な属性を削除）
2. 複数のBankに分割してデプロイ
3. ガス価格が低い時間帯を狙う

### 既存NFTが更新されない
1. ブラウザキャッシュをクリア
2. Composerのアドレスが正しく更新されているか確認
3. Metadataコントラクトが新しいComposerを参照しているか確認

## セキュリティ考慮事項

1. **アクセス制御**
   - URL更新関数にはownerOnly修飾子を設定
   - Composerの更新も権限管理が必要

2. **画像の検証**
   - 不適切なコンテンツが含まれていないか確認
   - SVGにスクリプトが含まれていないか確認

3. **バックアップ**
   - 元のBankアドレスを記録
   - ロールバック手順を準備

## まとめ

Tragedy NFTのモジュラー設計により、画像の差し替えは柔軟かつ効率的に行えます。既存のNFTへの影響を最小限に抑えながら、視覚的な更新が可能です。

更新タイプ別の推奨方法：
- **Arweave画像（Background/Effect）**: URL更新（最も簡単）
- **オンチェーンSVG（Monster/Item）**: 新規Bankデプロイ
- **部分的な変更**: カスタムBankの作成

計画的に実行すれば、ダウンタイムなしで画像の更新が可能です。