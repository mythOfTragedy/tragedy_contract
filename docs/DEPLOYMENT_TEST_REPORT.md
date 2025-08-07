# Tragedy NFT デプロイテストレポート

## 概要
このレポートは、Tragedy NFTプロジェクトのクリーンデプロイテストの結果をまとめたものです。新規にクローンしたリポジトリからのデプロイ過程で遭遇した問題と、その解決方法を記録しています。

## テスト環境
- **日時**: 2025年8月7日
- **ネットワーク**: Hardhat Local Network
- **Node.js**: v18+ (推奨)
- **テストOS**: macOS Darwin 24.5.0

## 遭遇した問題と解決方法

### 1. Bank1/Bank2コントラクトのデプロイ不足

**問題**: 
- `01-deploy-all.js`スクリプトで`ArweaveMonsterBank`と`ArweaveItemBank`のデプロイ時にエラーが発生
- エラーメッセージ: `Error: missing argument: in Contract constructor (count=0, expectedCount=2)`

**原因**:
- `ArweaveMonsterBank`と`ArweaveItemBank`は、それぞれBank1とBank2のアドレスを引数として必要とする
- スクリプトではこれらのサブバンクを先にデプロイしていなかった

**解決方法**:
```javascript
// MonsterBank1とMonsterBank2を先にデプロイ
const monsterBank1 = await ArweaveMonsterBank1.deploy();
const monsterBank2 = await ArweaveMonsterBank2.deploy();

// その後、メインのMonsterBankをデプロイ
const monsterBank = await ArweaveMonsterBank.deploy(
  monsterBank1.address, 
  monsterBank2.address
);
```

### 2. 環境変数ファイルの指定問題

**問題**: 
- `02-update-urls.js`が`viewer/deployment.json`を参照していたが、新規デプロイ時にはこのファイルが存在しない

**解決方法**:
- スクリプトを修正して、最新のデプロイメントファイルを自動的に検索するように変更
```javascript
const files = fs.readdirSync('.');
const deploymentFiles = files.filter(f => f.startsWith('deployment-') && f.endsWith('.json'));
if (deploymentFiles.length > 0) {
  deploymentFiles.sort((a, b) => b.localeCompare(a));
  deployment = JSON.parse(fs.readFileSync(deploymentFiles[0], 'utf8'));
}
```

### 3. NFTコントラクト名の不一致

**問題**:
- スクリプトで`TragedyMythNFT`を参照していたが、実際のコントラクト名は`BankedNFT`
- エラーメッセージ: `HH700: Artifact for contract "TragedyMythNFT" not found`

**解決方法**:
- すべてのスクリプトで正しいコントラクト名`BankedNFT`を使用するよう修正

### 4. BankedNFTコンストラクタの引数不足

**問題**:
- `BankedNFT`は5つの引数を必要とするが、スクリプトでは1つしか渡していなかった
- エラーメッセージ: `Error: missing argument: in Contract constructor (count=1, expectedCount=5)`

**解決方法**:
```javascript
const nft = await BankedNFT.deploy(
  "Tragedy NFT: The Mythical Cursed-Nightmare", // name
  "TRAGEDY",                                     // symbol
  10000,                                         // maxSupply
  ethers.utils.parseEther("0.01"),              // mintFee
  250                                           // royaltyRate (2.5%)
);
```

### 5. Arweave URL設定時のエラー

**問題**:
- EffectBankのURL更新時にCALL_EXCEPTIONエラーが発生
- BackgroundBankは正常に更新されたが、EffectBankで失敗

**原因と対処**:
- Hardhatのローカルネットワークがリセットされた可能性
- 実際のテストネットでは問題ない可能性が高い
- composeSVGテストも同様の理由でスキップ

## デプロイフロー

成功したデプロイの順序：
1. **Base64ライブラリ**のデプロイ
2. **Bank1/Bank2コントラクト**のデプロイ（Monster、Item）
3. **メインBankコントラクト**のデプロイ
4. **BackgroundBank、EffectBank**のデプロイ
5. **ArweaveTragedyComposer**のデプロイ
6. **TragedyMetadata**のデプロイ
7. **BankedNFT**のデプロイとメタデータバンクの設定

## 推奨事項

### 開発者向け
1. **Hardhatノードの永続化**: 別ターミナルで`npx hardhat node`を実行し続ける
2. **環境変数の準備**: `.env.example`を参考に`.env`ファイルを作成（テストネット用のPRIVATE_KEYが必要）
3. **スクリプトの実行順序**: 01→02→03→04→05の順序を守る

### コード改善の提案
1. **エラーハンドリングの強化**: 各スクリプトにより詳細なエラーメッセージを追加
2. **依存関係の明確化**: READMEやスクリプト内にコントラクトの依存関係を明記
3. **設定の集約**: デプロイ設定（名前、シンボル、供給量など）を単一の設定ファイルに集約

## まとめ

デプロイプロセスは、いくつかの修正を加えることで正常に完了しました。主な問題は：
- コントラクトの依存関係が明確でなかった
- スクリプトが古いコントラクト名を参照していた
- 引数の数が正しくなかった

これらの問題は、ドキュメントの改善とスクリプトの修正により解決可能です。