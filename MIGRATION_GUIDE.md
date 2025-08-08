# Migration Guide: 旧デプロイシステムから新システムへ

## 概要

このガイドは、既存のデプロイスクリプトから新しい統一デプロイシステムへの移行方法を説明します。

## 移行対象

### 旧スクリプト → 新コマンドの対応表

| 旧コマンド/スクリプト | 新コマンド | 説明 |
|---------------------|-----------|------|
| `npx hardhat run scripts/deploy-clean.js --network bonsoleil` | `npm run deploy:private` | クリーンデプロイ |
| `npx hardhat run scripts/deploy-production.js --network bonsoleil` | `npm run deploy:private` | 本番デプロイ |
| `npx hardhat run scripts/01-deploy-all.js --network bonsoleil` | `npm run deploy:private` | ワークフローデプロイ |
| `./deploy.sh bonsoleil --with-nft` | `npm run deploy:private` | シェルスクリプトデプロイ |
| 手動検証 | `npm run verify:private` | 自動検証 |

### レガシーコマンド（一時的に利用可能）

移行期間中は、`legacy:` プレフィックス付きで旧コマンドも利用できます：
- `npm run legacy:deploy-workflow`
- `npm run legacy:deploy`
- `npm run legacy:test-composition`
- `npm run legacy:test-minting`

## 主な変更点

### 1. 設定の一元化

**旧システム**: 各スクリプトに設定がハードコード
**新システム**: `deploy.config.json`で全設定を管理

```json
{
  "contracts": {
    "nft": {
      "name": "Tragedy NFT",
      "symbol": "TRAGEDY",
      "maxSupply": 10000,
      "mintFee": "0.01",
      "royaltyRate": 250
    }
  }
}
```

### 2. デプロイ履歴の管理

**旧システム**: 
- タイムスタンプ付きファイルが散在
- `viewer/deployment.json`の手動更新が必要な場合あり

**新システム**:
- `deployments/` ディレクトリに整理
- `deployments/current.json`が最新を示す
- `viewer/deployment.json`は自動更新

### 3. 自動検証

**旧システム**: デプロイ後に手動でテストスクリプトを実行
**新システム**: デプロイ完了後に自動で検証実行

### 4. エラーハンドリング

**旧システム**: エラー時の状態が不明確
**新システム**: 
- 明確なエラーメッセージ
- カラーコード付き出力
- 失敗したテストの詳細表示

## 移行手順

### ステップ1: 現在の状態を確認

```bash
# 現在のデプロイ状態を確認
cat viewer/deployment.json

# 最新のデプロイ履歴を確認
ls -la deployments/
```

### ステップ2: 新システムでテストデプロイ

```bash
# コンパイル
npx hardhat compile

# プライベートチェーンにデプロイ
npm run deploy:private

# 検証を実行
npm run verify:private
```

### ステップ3: 結果を確認

```bash
# デプロイ結果を確認
cat deployments/current.json

# viewerの更新を確認
cat viewer/deployment.json
```

## トラブルシューティング

### Q: 旧スクリプトの特定の機能が必要な場合

A: `legacy:` プレフィックス付きコマンドを使用：
```bash
npm run legacy:deploy-workflow
```

### Q: カスタムネットワークへのデプロイ

A: 直接Hardhatコマンドを使用：
```bash
npx hardhat run scripts/deploy/main.js --network <network-name>
```

### Q: デプロイ設定をカスタマイズしたい

A: `deploy.config.json`を編集：
```json
{
  "contracts": {
    "nft": {
      "mintFee": "0.02"  // 変更
    }
  }
}
```

### Q: 検証のみ実行したい

A: 検証コマンドを使用：
```bash
npm run verify:testnet
```

## 注意事項

1. **後方互換性**: 旧スクリプトは`scripts/archive/`に保存されています
2. **設定の移行**: カスタム設定は`deploy.config.json`に移動してください
3. **自動化**: 新システムは多くのプロセスを自動化しています

## サポート

問題が発生した場合：
1. エラーメッセージを確認
2. `deployments/`ディレクトリの履歴を確認
3. 必要に応じて旧スクリプト（`legacy:`コマンド）を使用

---
*Migration Guide v1.0 - 2025-08-07*