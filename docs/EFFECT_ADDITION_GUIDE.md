# Effect Addition Guide / エフェクト追加ガイド

This guide explains how to add new effects to the EffectBank contract.
このガイドでは、EffectBankコントラクトに新しいエフェクトを追加する方法を説明します。

## Prerequisites / 前提条件

1. New effect images uploaded to Arweave
2. Arweave URLs for the new effects
3. Effect names decided

## Steps to Add Effects / エフェクト追加手順

### 1. Update EffectBank Contract / EffectBankコントラクトの更新

Edit `contracts/ArweaveEffectBank.sol`:

#### a. Update effect names array size and add new names:
```solidity
// Change from [10] to [12] (or your new total)
string[12] public effectNames = [
    "Seizure",
    "Mindblast",
    "Confusion",
    "Meteor",
    "Bats",
    "Poisoning",
    "Lightning",
    "Blizzard",
    "Burning",
    "Brainwash",
    "Blackout",    // New effect
    "Matrix"       // New effect
];
```

#### b. Add new URLs in `_initializeUrls()`:
```solidity
function _initializeUrls() private {
    // Existing URLs...
    effectUrls[0] = "https://...";
    // ...
    effectUrls[9] = "https://...";
    
    // Add new effect URLs
    effectUrls[10] = "https://arweave.net/Re2AJZkxWB-Y3wgNOqpwKJDvc_BBM869GiGlBlCsbZI"; // Blackout
    effectUrls[11] = "https://arweave.net/Ajas3JTP0OL727D7uBMGX_6pJsOnINV9BEewkufnQDo"; // Matrix
}
```

#### c. Update all validation checks:
Change all occurrences of `require(id < 10, "Invalid effect ID");` to:
```solidity
require(id < 12, "Invalid effect ID");
```

Locations to update:
- `getEffectUrl()` function
- `getEffectName()` function
- `setEffectUrl()` function
- `setMultipleUrls()` function (in the loop)

### 2. Update Test Scripts / テストスクリプトの更新

#### a. Update `scripts/test-effect-layer.js`:

1. Change the loop range:
```javascript
// From:
for (let i = 0; i < 10; i++) {

// To:
for (let i = 0; i < 12; i++) {
```

2. Update edge case tests:
```javascript
// From:
await effectBank.getEffectName(10);

// To:
await effectBank.getEffectName(12);
```

3. Update the note about effect count:
```javascript
console.log("  📝 Note: Effects expanded to 12 (was 10)");
```

#### b. Update `scripts/test-material-layer.js` if it has any references to effect count.

### 3. Compile and Deploy / コンパイルとデプロイ

```bash
# Compile the updated contract
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/01-deploy-all.js --network bonsoleil

# Test the effect layer
npx hardhat run scripts/test-effect-layer.js --network bonsoleil
```

### 4. Verify the New Effects / 新しいエフェクトの確認

After deployment, verify:
1. All 12 effects are accessible
2. New effect names are correct
3. New Arweave URLs are working
4. Edge cases (ID 12+) properly revert

### 5. Update Documentation / ドキュメントの更新

Update any documentation that references the effect count:
- README files
- API documentation
- User guides

## Example: Adding Effects 10 and 11 / 例：エフェクト10と11の追加

For this update, we added:
- **Effect 10: Blackout** - Complete darkness effect
  - URL: `https://arweave.net/Re2AJZkxWB-Y3wgNOqpwKJDvc_BBM869GiGlBlCsbZI`
- **Effect 11: Matrix** - Digital rain effect
  - URL: `https://arweave.net/Ajas3JTP0OL727D7uBMGX_6pJsOnINV9BEewkufnQDo`

## Rollback Procedure / ロールバック手順

If issues occur:
1. Revert the contract changes
2. Redeploy the previous version
3. Update the Composer to point to the old EffectBank address

## Notes / 注意事項

- Always test on testnet first
- Keep track of deployment addresses
- Ensure all dependent contracts (like Composer) are updated if needed
- Consider gas costs when adding many effects at once