# Tragedy NFT - テキスト差し替えガイド

## 概要

Tragedy NFTのテキスト要素（タイトル、ストーリー、説明文、シナジー）は**TragedyMetadata**コントラクトで管理されています。このガイドでは、これらのテキスト要素を変更・カスタマイズする方法を説明します。

## テキスト要素の種類と生成場所

### TragedyMetadataで管理されるテキスト

1. **NFT名（Title）**
   - 関数: `getNFTName()`
   - 形式: `"{Monster} of {Background} #{TokenID}"`
   - 例: "Werewolf of Bloodmoon #1234"

2. **説明文（Description）**
   - 関数: `getNarrativeDescription()`
   - 各要素の組み合わせで動的生成
   - 例: "In the crimson realm where reality bleeds, a savage werewolf crowned with authority manifests violent tremors."

3. **シナジー名と説明**
   - 関数: `checkSynergy()`
   - 特別な組み合わせで発動
   - 例: "Blood Moon Rising" - "The werewolf's primal fury reaches its apex."

4. **レアリティ**
   - 関数: `getRarity()`
   - Common, Uncommon, Rare, Epic, Legendary, Mythic

## テキスト差し替え手順

### 方法1: 新しいMetadataコントラクトのデプロイ（推奨）

最もクリーンで安全な方法です。

#### 1. TragedyMetadataをカスタマイズ
```solidity
// contracts/TragedyMetadataCustom.sol
contract TragedyMetadataCustom is IMetadataBank {
    
    // カスタムタイトル生成
    function getNFTName(
        uint256 tokenId,
        string memory monster,
        string memory background
    ) internal pure returns (string memory) {
        // 例: 日本語タイトル
        return string(abi.encodePacked(
            getJapaneseMonsterName(monster),
            "の",
            getJapaneseBackgroundName(background),
            " #",
            tokenId.toString()
        ));
    }
    
    // カスタムストーリー生成
    function getNarrativeDescription(
        string memory monster,
        string memory background,
        string memory item,
        string memory effect
    ) internal pure returns (string memory) {
        // より詳細なストーリーテリング
        return string(abi.encodePacked(
            "かつて", getJapaneseBackgroundStory(background), "において、",
            getJapaneseMonsterStory(monster), "が",
            getJapaneseItemStory(item), "を手にし、",
            getJapaneseEffectStory(effect), "に見舞われた。"
        ));
    }
}
```

#### 2. 新しいMetadataをデプロイ
```javascript
// scripts/deploy-custom-metadata.js
async function main() {
  const composer = "0x845c8472752a5DE84DCEDab0848f3a9ab6f3Ab36"; // 既存のComposer
  
  const CustomMetadata = await ethers.getContractFactory("TragedyMetadataCustom");
  const metadata = await CustomMetadata.deploy(composer);
  await metadata.deployed();
  
  console.log("Custom Metadata deployed to:", metadata.address);
}
```

#### 3. BankedNFTのMetadataBankを更新
```javascript
// scripts/update-metadata-bank.js
async function main() {
  const nft = await ethers.getContractAt(
    "BankedNFT",
    "0x4E5bAFC300e384b46C942097Bf020DaA77EE3fa4"
  );
  
  const newMetadata = "0x新しいMetadataアドレス";
  await nft.setMetadataBank(newMetadata);
  
  console.log("Metadata bank updated!");
}
```

### 方法2: シナジーの追加・変更

新しいシナジーを追加したい場合の例。

```solidity
// contracts/ExtendedSynergyMetadata.sol
function checkSynergy(
    string memory monster,
    string memory item,
    string memory background,
    string memory effect
) public pure returns (SynergyResult memory) {
    // 既存のシナジーチェック
    SynergyResult memory baseResult = super.checkSynergy(monster, item, background, effect);
    if (baseResult.hasSynergy) return baseResult;
    
    // カスタムシナジーの追加
    if (keccak256(bytes(monster)) == keccak256(bytes("Dragon")) &&
        keccak256(bytes(item)) == keccak256(bytes("Crown"))) {
        return SynergyResult(
            true, 
            "Dragon Emperor", 
            "The ancient wyrm claims its rightful throne, commanding all lesser beings.",
            2  // レアリティボーナス
        );
    }
    
    // 季節限定シナジー
    if (isHalloweenSeason() && 
        keccak256(bytes(monster)) == keccak256(bytes("Ghost"))) {
        return SynergyResult(
            true,
            "Halloween Spirit",
            "The ghost's power peaks during the spooky season!",
            1
        );
    }
    
    return SynergyResult(false, "", "", 0);
}
```

### 方法3: ナラティブライブラリの活用

NarrativeGeneratorライブラリをカスタマイズして、より豊かなストーリーを生成。

```solidity
// contracts/libraries/CustomNarrativeGenerator.sol
library CustomNarrativeGenerator {
    
    struct StoryElements {
        string opening;
        string conflict;
        string climax;
        string resolution;
    }
    
    function generateEpicStory(
        string memory monster,
        string memory background,
        string memory item,
        string memory effect
    ) internal pure returns (string memory) {
        StoryElements memory story;
        
        // オープニング
        story.opening = getOpening(background, monster);
        
        // コンフリクト
        story.conflict = getConflict(monster, item);
        
        // クライマックス
        story.climax = getClimax(effect);
        
        // 結末
        story.resolution = getResolution(monster, background, item, effect);
        
        return string(abi.encodePacked(
            story.opening, " ",
            story.conflict, " ",
            story.climax, " ",
            story.resolution
        ));
    }
}
```

## カスタマイズ例

### 例1: 日本語化
```solidity
function getJapaneseMonsterName(string memory monster) internal pure returns (string memory) {
    bytes32 monsterHash = keccak256(bytes(monster));
    
    if (monsterHash == keccak256(bytes("Werewolf"))) return "人狼";
    if (monsterHash == keccak256(bytes("Vampire"))) return "吸血鬼";
    if (monsterHash == keccak256(bytes("Ghost"))) return "幽霊";
    if (monsterHash == keccak256(bytes("Demon"))) return "悪魔";
    if (monsterHash == keccak256(bytes("Dragon"))) return "龍";
    // ...
    
    return monster; // フォールバック
}
```

### 例2: 詩的な表現
```solidity
function getPoeticDescription(
    string memory monster,
    string memory background
) internal pure returns (string memory) {
    return string(abi.encodePacked(
        "Where ", getElementalEssence(background), " meets flesh,\n",
        "The ", getCreatureEpithet(monster), " awakens,\n",
        "Bound by ancient curses,\n",
        "Forever wandering between worlds."
    ));
}
```

### 例3: ゲーム風ステータス
```solidity
function getGameStyleDescription(
    uint256 tokenId,
    string memory monster,
    string memory item
) internal pure returns (string memory) {
    uint256 power = calculatePower(tokenId, monster, item);
    uint256 defense = calculateDefense(tokenId, monster, item);
    
    return string(abi.encodePacked(
        "Class: ", monster, "\n",
        "Equipment: ", item, "\n",
        "Power: ", power.toString(), "\n",
        "Defense: ", defense.toString(), "\n",
        "Special: ", getSpecialAbility(monster, item)
    ));
}
```

## 実装のベストプラクティス

### 1. ガス効率を考慮
```solidity
// 非効率的：文字列の多重連結
string memory story = "Once upon a time...";
story = string(abi.encodePacked(story, " there was a "));
story = string(abi.encodePacked(story, monster));

// 効率的：一度に連結
string memory story = string(abi.encodePacked(
    "Once upon a time, there was a ",
    monster,
    " in the ",
    background
));
```

### 2. 再利用可能な関数設計
```solidity
// 汎用的な形容詞マッピング
function getAdjective(string memory element, uint256 seed) internal pure returns (string memory) {
    string[5] memory adjectives = getAdjectiveSet(element);
    return adjectives[seed % 5];
}
```

### 3. アップグレード可能性
```solidity
contract TragedyMetadataV2 is TragedyMetadata {
    // 既存の機能を継承しつつ拡張
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory baseURI = super.tokenURI(tokenId);
        // カスタム要素を追加
        return addCustomElements(baseURI, tokenId);
    }
}
```

## テスト方法

### 1. ローカルテスト
```javascript
// scripts/test-custom-metadata.js
async function testMetadata() {
  const metadata = await ethers.getContractAt("TragedyMetadataCustom", "0x...");
  
  // テストケース
  const testCases = [
    { tokenId: 1, expected: "人狼の血月 #1" },
    { tokenId: 666, expected: "悪魔の奈落 #666" },
    { tokenId: 9999, expected: "龍の影 #9999" }
  ];
  
  for (const test of testCases) {
    const uri = await metadata.tokenURI(test.tokenId);
    const decoded = Buffer.from(uri.split(',')[1], 'base64').toString();
    const json = JSON.parse(decoded);
    
    console.log(`Token #${test.tokenId}:`);
    console.log("  Name:", json.name);
    console.log("  Description:", json.description);
    console.log("  Expected:", test.expected);
    console.log("  Match:", json.name === test.expected ? "✅" : "❌");
  }
}
```

### 2. ガス使用量の確認
```javascript
const tx = await metadata.tokenURI(1234);
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

## チェックリスト

### 新しいMetadataデプロイ時
- [ ] すべてのテキスト生成関数をテスト
- [ ] シナジーの組み合わせを確認
- [ ] ガス使用量が許容範囲内
- [ ] 特殊文字のエスケープ処理
- [ ] 既存のNFTとの互換性確認
- [ ] BankedNFTのsetMetadataBank実行

### テキスト変更時の考慮事項
- [ ] 文字数制限（OpenSeaなどの表示）
- [ ] 多言語対応の必要性
- [ ] SEO/検索性を考慮
- [ ] コミュニティのフィードバック反映

## トラブルシューティング

### メタデータが更新されない
1. MetadataBankが正しく設定されているか確認
2. キャッシュのクリア（OpenSea: Force Refresh Metadata）
3. tokenURIの呼び出しが正常か確認

### ガスリミットエラー
1. 文字列連結を最適化
2. 不要な計算を削減
3. ストレージ読み取りを最小化

### 文字化け
1. UTF-8エンコーディングを確認
2. Base64エンコードが正しいか確認
3. 特殊文字のエスケープ処理

## まとめ

TragedyMetadataのカスタマイズにより、NFTのストーリーテリングを自由に拡張できます。主な変更ポイント：

1. **タイトル形式**: getNFTName()をカスタマイズ
2. **ストーリー内容**: getNarrativeDescription()を拡張
3. **シナジーシステム**: checkSynergy()に新しい組み合わせを追加
4. **言語対応**: 各要素の名前を翻訳する関数を追加

画像と同様に、テキストもモジュラーに管理されているため、創造的な表現が可能です。