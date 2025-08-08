# Cleanup Summary - 2025-08-08

## ファイル整理実施内容

### 1. アーカイブされたファイル
以下のファイルを `archive/` ディレクトリに移動：
- `deployments/bonsoleil-2025-08-07T22-50-52.json`
- `deployments/clean-bonsoleil-1754584655554.json`

### 2. 削除されたファイル
- `deployment-bonsoleil-1754584600614.json` - ルートディレクトリの古いデプロイメントファイル
- `FINAL-token-mapping-1754570104957.csv` - 古いタイムスタンプ付きCSVファイル

### 3. .gitignore の更新
以下のパターンを追加：
- `archive/` - アーカイブディレクトリ全体
- `FINAL-token-mapping-*.csv` - タイムスタンプ付きCSVファイル
- `deployment-*.json` - ルートレベルのデプロイメントファイル
- `sample-*.svg` - サンプルSVGファイル
- `*.bak` - バックアップファイル

### 4. 保持されたファイル
- `deployments/current.json` - 現在のデプロイメント状態
- `deployments/private-2025-08-08T01-07-24.json` - 最新のプライベートチェーンデプロイメント
- `FINAL-token-mapping-1754570732134.csv` - 最新のトークンマッピング
- `scripts/archive/` - レガシースクリプト（参照用に保持）

## 今後の推奨事項

1. **定期的なクリーンアップ**
   - 古いデプロイメントログは定期的にアーカイブまたは削除
   - `deployments/current.json` のみを最新状態として維持

2. **バージョン管理**
   - タイムスタンプ付きファイルは基本的にgitignoreで除外
   - 重要な成果物のみをバージョン管理

3. **アーカイブポリシー**
   - 30日以上経過したデプロイメントログは自動的にアーカイブ
   - レガシースクリプトは参照用にarchiveディレクトリで保持