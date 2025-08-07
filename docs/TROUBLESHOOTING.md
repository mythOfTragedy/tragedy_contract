# Tragedy NFT - トラブルシューティングガイド

## 目次
- [よくあるエラーと解決方法](#よくあるエラーと解決方法)
- [デプロイ関連の問題](#デプロイ関連の問題)
- [実行環境の問題](#実行環境の問題)
- [ミント関連の問題](#ミント関連の問題)
- [Viewer関連の問題](#viewer関連の問題)
- [開発のヒント](#開発のヒント)

## よくあるエラーと解決方法

### 1. Error: missing argument: in Contract constructor

**エラーメッセージ**:
```
Error: missing argument: in Contract constructor (count=0, expectedCount=2, code=MISSING_ARGUMENT, version=contracts/5.8.0)
```

**原因**: 
- ArweaveMonsterBankやArweaveItemBankは、Bank1とBank2のアドレスを引数として必要とします

**解決方法**:
1. 先にBank1とBank2をデプロイ:
```javascript
const monsterBank1 = await ArweaveMonsterBank1.deploy();
const monsterBank2 = await ArweaveMonsterBank2.deploy();
```

2. その後、メインBankをデプロイ:
```javascript
const monsterBank = await ArweaveMonsterBank.deploy(
  monsterBank1.address,
  monsterBank2.address
);
```

### 2. HH700: Artifact for contract "TragedyMythNFT" not found

**エラーメッセージ**:
```
HardhatError: HH700: Artifact for contract "TragedyMythNFT" not found. Did you mean "BankedNFT"?
```

**原因**: 
- 古いコントラクト名を参照している

**解決方法**:
- すべてのスクリプトで`TragedyMythNFT`を`BankedNFT`に置き換える:
```javascript
// 誤り
const nft = await ethers.getContractAt("TragedyMythNFT", address);

// 正しい
const nft = await ethers.getContractAt("BankedNFT", address);
```

### 3. Error: too many/few arguments passed to contract

**エラーメッセージ**:
```
Error: missing argument: in Contract constructor (count=1, expectedCount=5)
```

**原因**: 
- BankedNFTは5つの引数を必要とする

**解決方法**:
```javascript
const nft = await BankedNFT.deploy(
  "Tragedy NFT: The Mythical Cursed-Nightmare",  // name
  "TRAGEDY",                                      // symbol
  10000,                                          // maxSupply
  ethers.utils.parseEther("0.01"),               // mintFee (0.01 ETH)
  250                                            // royaltyRate (2.5%)
);
```

### 4. Error: call revert exception

**エラーメッセージ**:
```
Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ]
```

**原因**: 
- Hardhatノードがリセットされた
- コントラクトがデプロイされていない
- 間違ったネットワークを使用している

**解決方法**:
1. Hardhatノードが実行中か確認
2. すべてのコントラクトを再デプロイ
3. 正しいネットワークフラグを使用: `--network localhost`

## デプロイ関連の問題

### スクリプトの実行順序

**重要**: スクリプトは必ず以下の順序で実行してください：

1. `01-deploy-all.js` - 基本コントラクトのデプロイ
2. `02-update-urls.js` - Arweave URLの設定
3. `03-test-composition.js` - コンポジション機能のテスト（オプション）
4. `04-deploy-nft.js` - NFTコントラクトのデプロイ
5. `05-test-minting.js` - ミント機能のテスト

### デプロイメントファイルが見つからない

**問題**: 
```
❌ No deployment file found. Run deployment scripts first!
```

**解決方法**:
1. デプロイスクリプトが正常に完了したか確認
2. `deployment-*.json`ファイルが作成されているか確認:
```bash
ls deployment-*.json
```

### 環境変数の問題

**問題**: 
- PRIVATE_KEYが設定されていない

**解決方法**:
1. `.env`ファイルを作成:
```bash
cp .env.example .env
```

2. PRIVATE_KEYを設定（0xプレフィックスなし）:
```
PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 実行環境の問題

### Hardhatノードの接続エラー

**エラーメッセージ**:
```
HardhatError: HH108: Cannot connect to the network localhost.
Please make sure your node is running
```

**解決方法**:
1. 別のターミナルでHardhatノードを起動:
```bash
npx hardhat node
```

2. ノードを起動したままにする

### ガス推定エラー

**問題**: 
- Transaction ran out of gas

**解決方法**:
1. `hardhat.config.js`でガス制限を増やす:
```javascript
networks: {
  hardhat: {
    gas: 10000000,
    gasPrice: 20000000000
  }
}
```

## ミント関連の問題

### ミント料金エラー

**エラーメッセージ**:
```
Error: InsufficientMintFee()
```

**解決方法**:
- 正しいミント料金を送信:
```javascript
const mintFee = await nft.mintFee();
const tx = await nft.mint({ value: mintFee });
```

### メタデータバンクが設定されていない

**エラーメッセージ**:
```
Error: MetadataBankNotSet()
```

**解決方法**:
- NFTデプロイ後にメタデータバンクを設定:
```javascript
await nft.setMetadataBank(metadata.address);
```

## Viewer関連の問題

### デプロイメント設定が読み込めない

**問題**: 
- "Failed to load deployment configuration"

**解決方法**:
1. デプロイメントファイルをviewerディレクトリにコピー:
```bash
cp deployment-hardhat-*.json viewer/deployment.json
```

### 画像が表示されない

**問題**: 
- Arweave画像が読み込まれない

**解決方法**:
1. ブラウザのコンソールでエラーを確認
2. Arweave URLが正しく設定されているか確認
3. CORSの問題がないか確認

### MetaMask接続エラー

**問題**: 
- MetaMaskが接続できない

**解決方法**:
1. 正しいネットワークに接続しているか確認
2. ローカルテストの場合: Localhost 8545
3. Bon-Soleilテストネットの場合: Chain ID 21201

## 開発のヒント

### デバッグ方法

1. **コンソールログの追加**:
```javascript
console.log("Contract address:", contract.address);
console.log("Transaction hash:", tx.hash);
```

2. **Hardhatコンソールの使用**:
```bash
npx hardhat console --network localhost
```

3. **イベントログの確認**:
```javascript
const receipt = await tx.wait();
console.log("Events:", receipt.events);
```

### ガス使用量の最適化

1. **コンパイラ設定の確認**:
```javascript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 100
    },
    viaIR: true
  }
}
```

2. **バッチ処理の活用**:
- 複数のNFTを一度にミントする場合は、バッチ機能を使用

### テストの実行

1. **個別機能のテスト**:
```bash
npx hardhat run scripts/test-metadata-v5.js --network localhost
npx hardhat run scripts/test-synergies.js --network localhost
```

2. **ガス使用量の確認**:
```javascript
console.log("Gas used:", receipt.gasUsed.toString());
```

## それでも解決しない場合

1. **エラーメッセージ全体をコピー**
2. **実行したコマンドの順序を記録**
3. **環境情報を収集**:
   - Node.jsバージョン: `node --version`
   - npmバージョン: `npm --version`
   - OS情報
4. **GitHubでissueを作成**

## 関連ドキュメント

- [QUICK_START.md](./QUICK_START.md) - クイックスタートガイド
- [DEPLOYMENT_TEST_REPORT.md](./DEPLOYMENT_TEST_REPORT.md) - デプロイテストの詳細レポート
- [CONTRACT_DESIGN.md](./CONTRACT_DESIGN.md) - コントラクト設計の詳細