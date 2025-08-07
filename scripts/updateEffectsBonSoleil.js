const hre = require("hardhat");

async function main() {
    console.log("=== Bon-Soleil Testnet エフェクト差し替えテスト ===\n");
    
    // デプロイ済みのEffectBankアドレス
    const effectBankAddress = "0x3b008D87C86fC0b2f5F0f52509FA1186Fb4CB735";
    
    // コントラクトを取得
    const effectBank = await hre.ethers.getContractAt("ArweaveEffectBank", effectBankAddress);
    
    // 新しいエフェクトURL
    const newMeteorUrl = "https://arweave.net/qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE";
    const newBurningUrl = "https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA";
    
    console.log("現在のエフェクトURLを確認中...");
    const currentMeteor = await effectBank.getEffectUrl(3);
    const currentBurning = await effectBank.getEffectUrl(8);
    
    console.log("\n【現在のURL】");
    console.log("Meteor (ID 3):");
    console.log("  ", currentMeteor);
    console.log("Burning (ID 8):");
    console.log("  ", currentBurning);
    
    console.log("\n【新しいURL】");
    console.log("Meteor (ID 3):");
    console.log("  ", newMeteorUrl);
    console.log("Burning (ID 8):");
    console.log("  ", newBurningUrl);
    
    // ユーザーに確認
    console.log("\n差し替えを実行しています...");
    
    try {
        // Meteorエフェクトを更新
        console.log("\n1. Meteorエフェクトを更新中...");
        const meteorTx = await effectBank.setEffectUrl(3, newMeteorUrl);
        console.log("   トランザクション送信: ", meteorTx.hash);
        await meteorTx.wait();
        console.log("   ✅ Meteor更新完了!");
        
        // Burningエフェクトを更新
        console.log("\n2. Burningエフェクトを更新中...");
        const burningTx = await effectBank.setEffectUrl(8, newBurningUrl);
        console.log("   トランザクション送信: ", burningTx.hash);
        await burningTx.wait();
        console.log("   ✅ Burning更新完了!");
        
        // 更新後のURLを確認
        console.log("\n更新後のURLを確認中...");
        const updatedMeteor = await effectBank.getEffectUrl(3);
        const updatedBurning = await effectBank.getEffectUrl(8);
        
        console.log("\n【更新後のURL】");
        console.log("Meteor (ID 3):");
        console.log("  ", updatedMeteor);
        console.log("  更新成功:", updatedMeteor === newMeteorUrl ? "✅" : "❌");
        console.log("Burning (ID 8):");
        console.log("  ", updatedBurning);
        console.log("  更新成功:", updatedBurning === newBurningUrl ? "✅" : "❌");
        
        // 全エフェクトの一覧を表示
        console.log("\n【全エフェクト一覧】");
        const effectNames = ["Seizure", "Mindblast", "Confusion", "Meteor", "Bats", 
                           "Poisoning", "Lightning", "Blizzard", "Burning", "Brainwash"];
        for (let i = 0; i < 10; i++) {
            const url = await effectBank.getEffectUrl(i);
            console.log(`${i}: ${effectNames[i]}`);
            console.log(`   ${url}`);
        }
        
        console.log("\n✅ エフェクト差し替えテスト完了!");
        console.log("\nExplorer URLs:");
        console.log(`Meteor TX: https://testnet.snowtrace.io/tx/${meteorTx.hash}`);
        console.log(`Burning TX: https://testnet.snowtrace.io/tx/${burningTx.hash}`);
        
    } catch (error) {
        console.error("\n❌ エラーが発生しました:", error.message);
        if (error.message.includes("Only owner")) {
            console.error("このアドレスはEffectBankのオーナー権限を持っていません。");
            const owner = await effectBank.owner();
            console.error("現在のオーナー:", owner);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });