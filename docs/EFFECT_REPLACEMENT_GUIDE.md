# エフェクトマテリアル差し替えガイド

## 概要
このガイドでは、Myth of Tragedyのエフェクトマテリアル（Meteor、Burningなど）を新しいArweaveアセットに差し替える手順を説明します。

## 現在のエフェクト構成

### エフェクトの保存場所
エフェクトURLは`ArweaveEffectBank.sol`コントラクトに保存されています：

```solidity
// contracts/ArweaveEffectBank.sol
effectUrls[3] = "https://jxi6ywfbf4eincugauogqzljn3hfwlcnsxtgplihfqkijxzvamxa.arweave.net/TdHsWKEvCIaKhgUcaGVpbs5bLE2V5metBywUhN81Ay4"; // Meteor
effectUrls[8] = "https://4xilt2jbun6zo5xus37tjclqofafrntncwxecnnltxclbxtwmuya.arweave.net/5dC56SGjfZd29Jb_NIlwcUBYtm0VrkE1q53EsN52ZTA"; // Burning
```

### エフェクトIDマッピング
```
ID 0: Seizure
ID 1: Mindblast
ID 2: Confusion
ID 3: Meteor ← 差し替え対象
ID 4: Bats
ID 5: Poisoning
ID 6: Lightning
ID 7: Blizzard
ID 8: Burning ← 差し替え対象
ID 9: Brainwash
```

## 差し替え手順

### 方法1: 既存コントラクトのURL更新（推奨）

最も簡単で、既存のNFTへの影響がない方法です。

#### 1. 準備
```bash
# プロジェクトディレクトリに移動
cd /Users/goodsun/develop/mythOfTragedy/main_contract

# 環境変数を設定
source .env
```

#### 2. 更新スクリプトの作成
```javascript
// scripts/updateEffects.js
const hre = require("hardhat");

async function main() {
    // デプロイ済みのEffectBankアドレスを取得
    const effectBankAddress = "YOUR_EFFECT_BANK_ADDRESS"; // 実際のアドレスに置き換え
    
    // コントラクトを取得
    const effectBank = await hre.ethers.getContractAt("ArweaveEffectBank", effectBankAddress);
    
    // 新しいエフェクトURL
    const newMeteorUrl = "https://arweave.net/qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE";
    const newBurningUrl = "https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA";
    
    console.log("現在のURLを確認...");
    console.log("Meteor (現在):", await effectBank.getEffectUrl(3));
    console.log("Burning (現在):", await effectBank.getEffectUrl(8));
    
    // Meteorエフェクトを更新
    console.log("\nMeteorエフェクトを更新中...");
    const meteorTx = await effectBank.setEffectUrl(3, newMeteorUrl);
    await meteorTx.wait();
    console.log("Meteor更新完了:", meteorTx.hash);
    
    // Burningエフェクトを更新
    console.log("\nBurningエフェクトを更新中...");
    const burningTx = await effectBank.setEffectUrl(8, newBurningUrl);
    await burningTx.wait();
    console.log("Burning更新完了:", burningTx.hash);
    
    // 更新後のURLを確認
    console.log("\n更新後のURL:");
    console.log("Meteor (新):", await effectBank.getEffectUrl(3));
    console.log("Burning (新):", await effectBank.getEffectUrl(8));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

#### 3. スクリプトの実行
```bash
# テストネットで実行
npx hardhat run scripts/updateEffects.js --network bonSoleil

# メインネットで実行（注意！）
npx hardhat run scripts/updateEffects.js --network mainnet
```

### 方法2: 新しいEffectBankをデプロイ

より大規模な変更や、複数のエフェクトを一度に更新する場合に適しています。

#### 1. 新しいEffectBankコントラクトを作成
```solidity
// contracts/ArweaveEffectBankV2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArweaveEffectBankV2 {
    string[10] public effectUrls;
    address public owner;
    
    constructor() {
        owner = msg.sender;
        
        // 既存のエフェクトを維持
        effectUrls[0] = "https://arweave.net/EvUvQEMCKTmVVQRr82W2g-vIyj3n5S-dqBdrLXxSMsg";
        effectUrls[1] = "https://arweave.net/KQ7l4s6zs0IY2aD-ksw4OC3Lqd9A5sc6NCLyR9aIijk";
        effectUrls[2] = "https://arweave.net/BvQUNhFp4vg0TYFLhLO9I6f6F3bAlQu-qvJ1xZeFOZs";
        
        // 新しいMeteorとBurning
        effectUrls[3] = "https://arweave.net/qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE"; // 新Meteor
        effectUrls[4] = "https://arweave.net/RJCKqpLo43IvQcJJqMqiHU7rXcCcXIkyDFKfX-9k3x8";
        effectUrls[5] = "https://arweave.net/mhYsEq84xnZF23aEcW-H7OKPdKULDH65hNvnUPQP80c";
        effectUrls[6] = "https://arweave.net/7VXa7Uu72s0aCQHMPbP1HV2Y5P7xZsXaF2yYyLRCIZA";
        effectUrls[7] = "https://arweave.net/W7hFIY0h3PBKzD7a2Bqa3dDBpSNJtH7uZXdkh6K3Lp0";
        effectUrls[8] = "https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA"; // 新Burning
        effectUrls[9] = "https://arweave.net/ovB0O--cVqTM0SvW-3lQl-U0zUHdYGPQsQflm9zc3ow";
    }
    
    function getEffectUrl(uint256 effectId) external view returns (string memory) {
        require(effectId < 10, "Invalid effect ID");
        return effectUrls[effectId];
    }
    
    function setEffectUrl(uint256 effectId, string memory url) external {
        require(msg.sender == owner, "Only owner");
        require(effectId < 10, "Invalid effect ID");
        effectUrls[effectId] = url;
    }
}
```

#### 2. デプロイとComposerの更新
```javascript
// scripts/deployNewEffectBank.js
const hre = require("hardhat");

async function main() {
    // 新しいEffectBankをデプロイ
    const EffectBankV2 = await hre.ethers.getContractFactory("ArweaveEffectBankV2");
    const effectBank = await EffectBankV2.deploy();
    await effectBank.deployed();
    console.log("新しいEffectBank deployed to:", effectBank.address);
    
    // Composerのアドレスを取得
    const composerAddress = "YOUR_COMPOSER_ADDRESS";
    const composer = await hre.ethers.getContractAt("ArweaveTragedyComposer", composerAddress);
    
    // ComposerのEffectBank参照を更新
    const updateTx = await composer.setEffectBank(effectBank.address);
    await updateTx.wait();
    console.log("Composer updated with new EffectBank");
}
```

## 検証手順

### 1. コントラクトで直接確認
```javascript
// scripts/verifyEffects.js
const hre = require("hardhat");

async function main() {
    const effectBankAddress = "YOUR_EFFECT_BANK_ADDRESS";
    const effectBank = await hre.ethers.getContractAt("ArweaveEffectBank", effectBankAddress);
    
    console.log("=== エフェクトURL確認 ===");
    console.log("Meteor (ID 3):", await effectBank.getEffectUrl(3));
    console.log("Burning (ID 8):", await effectBank.getEffectUrl(8));
}
```

### 2. NFTメタデータで確認
```javascript
// scripts/checkNFTWithEffects.js
const hre = require("hardhat");

async function main() {
    const nftAddress = "YOUR_NFT_CONTRACT_ADDRESS";
    const nft = await hre.ethers.getContractAt("MythOfTragedy", nftAddress);
    
    // MeteorエフェクトのあるNFTを確認
    const tokenId = 123; // 実際のトークンIDに置き換え
    const uri = await nft.tokenURI(tokenId);
    
    // Base64デコード
    const json = Buffer.from(uri.split(',')[1], 'base64').toString();
    const metadata = JSON.parse(json);
    
    console.log("Token", tokenId, "metadata:");
    console.log("Image:", metadata.image);
    
    // SVGを確認してエフェクトURLが含まれているか確認
    const svg = Buffer.from(metadata.image.split(',')[1], 'base64').toString();
    console.log("\nSVG contains new effect URL:", svg.includes("qMxaHOR-v_PojOK"));
}
```

### 3. ブラウザで直接確認
新しいエフェクトURLをブラウザで開いて、正しい画像が表示されることを確認：
- Meteor: https://arweave.net/qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE
- Burning: https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA

## トラブルシューティング

### エラー: "Only owner"
- EffectBankのowner権限を持つウォレットから実行する必要があります
- `await effectBank.owner()`でオーナーアドレスを確認

### エラー: "Invalid effect ID"
- エフェクトIDは0-9の範囲内である必要があります
- Meteor = 3, Burning = 8

### 画像が表示されない
1. ArweaveのURLが正しいか確認
2. 画像のContent-Typeが正しいか確認（SVG形式である必要）
3. CORS設定を確認（Arweaveは通常CORS対応済み）

## 注意事項

1. **ガス代**: URL更新にはガス代がかかります。テストネットで十分にテストしてください
2. **既存NFTへの影響**: 方法1（URL更新）を使用すれば、既存のNFTは自動的に新しいエフェクトを表示します
3. **バックアップ**: 古いURLは記録しておき、必要に応じて戻せるようにしてください
4. **キャッシュ**: ブラウザやマーケットプレイスのキャッシュにより、変更が即座に反映されない場合があります

## まとめ

エフェクトの差し替えは、モジュラー設計により簡単に実行できます。推奨される方法は既存コントラクトのURL更新（方法1）で、これにより：
- 既存のNFTに影響を与えずに更新可能
- ガス代を最小限に抑えられる
- 即座に全てのNFTに反映される

新しいエフェクトを追加したり、大規模な変更を行う場合は、新しいEffectBankのデプロイ（方法2）を検討してください。