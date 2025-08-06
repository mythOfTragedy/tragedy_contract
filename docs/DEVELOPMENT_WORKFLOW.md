# 🔄 4層アーキテクチャ開発ワークフロー

## 概要

ボトムアップアプローチにより、各層を独立してテスト・検証しながら積み上げることで、確実で効率的な開発が可能です。

---

## 📊 開発フローチャート

```
┌─────────────────┐
│ 1. Material層   │ ← まずここから
│   開発・テスト  │
└────────┬────────┘
         │ ✅ 素材が正しく保存・取得できる
         ▼
┌─────────────────┐
│ 2. Composer層   │
│   開発・テスト  │
└────────┬────────┘
         │ ✅ SVG/テキストが正しく生成される
         ▼
┌─────────────────┐
│ 3. Metadata層   │
│   開発・テスト  │
└────────┬────────┘
         │ ✅ JSONメタデータが完成
         ▼
┌─────────────────┐
│ 4. NFT層        │
│   開発・テスト  │
└────────┬────────┘
         │ ✅ NFTとして機能
         ▼
┌─────────────────┐
│ 5. フロントエンド│
│   実装・テスト  │
└─────────────────┘
```

---

## 🚀 各フェーズの詳細

### Phase 1: Material層の開発（Week 1）

#### 1.1 開発
```solidity
// MaterialBankのデプロイ
const materialBank = await MaterialBank.deploy();

// 素材の追加
await materialBank.setMaterial(SPECIES, 0, "Dragon", dragonSVG);
await materialBank.setMaterial(EQUIPMENT, 1, "Sword", swordSVG);
```

#### 1.2 テスト
```javascript
it("素材が正しく保存される", async () => {
    const svg = await materialBank.getMaterial(SPECIES, 0);
    expect(svg).to.include('<g id="dragon">');
});
```

#### 1.3 確認ツール
```javascript
// 簡単なビューワーで素材を確認
const viewer = await MaterialViewer.deploy(materialBank.address);
const allMaterials = await viewer.getAllMaterials();
// → HTMLで表示して視覚的に確認
```

**成果物**: 全素材が正しく保存されたMaterialBank ✅

---

### Phase 2: Composer層の開発（Week 2）

#### 2.1 SVGComposer
```solidity
const svgComposer = await SVGComposer.deploy(materialBank.address);

// 単体テスト
const svg = await svgComposer.composeSVG(
    0, // background: Bloodmoon
    6, // character: Vampire
    5, // item: Wine
    4  // effect: Bats
);
```

#### 2.2 TextComposer
```solidity
const textComposer = await TextComposer.deploy();

// テンプレートテスト
const name = await textComposer.composeName(123, 6, 5);
expect(name).to.equal("Blood Sommelier #123");
```

#### 2.3 プレビューツール
```javascript
// Composerの出力を即座に確認
const preview = await ComposerPreview.deploy(
    svgComposer.address,
    textComposer.address
);

// ブラウザで表示
const result = await preview.generatePreview(6, 5, 0, 4);
displayInBrowser(result.svg, result.name, result.description);
```

**成果物**: 完全に動作するComposer群 ✅

---

### Phase 3: Metadata層の開発（Week 3）

#### 3.1 MetadataBank実装
```solidity
const metadataBank = await MetadataBank.deploy(
    svgComposer.address,
    textComposer.address
);
```

#### 3.2 メタデータ検証
```javascript
// 実際のメタデータを生成
const metadata = await metadataBank.getMetadata(1234);
const decoded = decodeBase64(metadata);
const json = JSON.parse(decoded);

// OpenSeaと同じ形式か確認
expect(json).to.have.property('name');
expect(json).to.have.property('description');
expect(json).to.have.property('image');
expect(json).to.have.property('attributes');
```

#### 3.3 メタデータビューワー
```html
<!-- metadata-viewer.html -->
<div id="nft-preview">
    <img src="${json.image}" />
    <h2>${json.name}</h2>
    <p>${json.description}</p>
    <ul>
        ${json.attributes.map(attr => 
            `<li>${attr.trait_type}: ${attr.value}</li>`
        )}
    </ul>
</div>
```

**成果物**: 完全なメタデータ生成システム ✅

---

### Phase 4: NFT層の実装（Week 4）

#### 4.1 最小限の実装
```solidity
const bankedNFT = await BankedNFT.deploy(
    "Monster NFT",
    "MONSTER",
    10000,
    ethers.utils.parseEther("0.01"),
    250
);

await bankedNFT.setMetadataBank(metadataBank.address);
```

#### 4.2 ミントテスト
```javascript
// 実際にミント
await bankedNFT.mint({ value: ethers.utils.parseEther("0.01") });

// tokenURIが正しく返るか
const uri = await bankedNFT.tokenURI(1);
const metadata = decodeTokenURI(uri);
```

**成果物**: 完全に機能するNFTコントラクト ✅

---

### Phase 5: フロントエンド開発（Week 5-6）

#### 5.1 プレビュー機能
```javascript
// React Component
function NFTPreview({ tokenId }) {
    const [metadata, setMetadata] = useState(null);
    
    useEffect(() => {
        // MetadataBankから直接取得！
        const data = await metadataBank.getMetadata(tokenId);
        setMetadata(decodeMetadata(data));
    }, [tokenId]);
    
    return (
        <div className="nft-card">
            <img src={metadata?.image} />
            <h3>{metadata?.name}</h3>
            <p>{metadata?.description}</p>
        </div>
    );
}
```

#### 5.2 ミント前プレビュー
```javascript
// ミント前に見た目を確認
function MintPreview() {
    const [preview, setPreview] = useState(null);
    
    const generatePreview = async () => {
        // 次のtokenIdを取得
        const nextId = await bankedNFT.totalSupply() + 1;
        
        // メタデータを生成（ミント前！）
        const metadata = await metadataBank.getMetadata(nextId);
        setPreview(decodeMetadata(metadata));
    };
    
    return (
        <div>
            <button onClick={generatePreview}>
                次のNFTをプレビュー
            </button>
            {preview && <NFTPreview data={preview} />}
        </div>
    );
}
```

---

## 🎯 ワークフローの利点

### 1. **段階的な検証**
- 各層が独立してテスト可能
- 問題の早期発見
- デバッグが容易

### 2. **並行開発**
```
開発者A: Material層とSVGComposer
開発者B: TextComposerとテンプレート
開発者C: フロントエンドのモックアップ
→ 全員が同時に作業可能！
```

### 3. **実データでの開発**
- Metadata層完成後は実際のデータでフロント開発
- モックデータ不要
- デザイナーも実物を見ながら調整

### 4. **段階的なリリース**
```
Day 1: MaterialBankデプロイ → 素材確認可能
Day 3: Composerデプロイ → プレビュー可能
Day 5: MetadataBankデプロイ → メタデータ確認可能
Day 7: NFTデプロイ → ミント開始！
```

---

## 🛠️ 開発支援ツール

### 1. Layer Viewer
```solidity
contract LayerViewer {
    // 各層の出力を確認
    function viewMaterial(type, id) external view returns (string memory);
    function viewComposition(bg, char, item, effect) external view returns (string memory);
    function viewMetadata(tokenId) external view returns (string memory);
}
```

### 2. Test Helper
```javascript
// テストヘルパー関数
async function deployFullStack() {
    const material = await deployMaterialBank();
    const composers = await deployComposers(material);
    const metadata = await deployMetadataBank(composers);
    const nft = await deployNFT(metadata);
    
    return { material, composers, metadata, nft };
}
```

### 3. Preview Dashboard
```html
<!-- preview-dashboard.html -->
<div class="dashboard">
    <section class="materials">
        <!-- 全素材一覧 -->
    </section>
    <section class="composer">
        <!-- 合成プレビュー -->
    </section>
    <section class="metadata">
        <!-- JSON表示 -->
    </section>
    <section class="nft">
        <!-- 最終形態 -->
    </section>
</div>
```

---

## 📈 成功指標

各フェーズの完了基準：

| フェーズ | 成功基準 | 確認方法 |
|---------|----------|----------|
| Material | 全素材が正しく保存 | ビューワーで視覚確認 |
| Composer | 正しい合成結果 | プレビューツール |
| Metadata | 有効なJSON生成 | OpenSea互換性チェック |
| NFT | ミント・転送可能 | テストネットで確認 |
| Frontend | UX完成 | ユーザーテスト |

---

## まとめ

このワークフローにより：

1. **確実な進行** - 各層を確認しながら進める
2. **早期の価値提供** - 各層完成時点で成果物
3. **チーム効率** - 並行作業が可能
4. **品質保証** - 段階的なテストで高品質

まさに**アジャイル開発の理想形**です！🚀