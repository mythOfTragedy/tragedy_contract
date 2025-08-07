const hre = require("hardhat");

async function main() {
    console.log("=== エフェクト変更の確認 ===\n");
    
    // Bon-Soleil testnetのコントラクトアドレス
    const composerAddress = "0x845c8472752a5DE84DCEDab0848f3a9ab6f3Ab36";
    
    // テスト用のパラメータ（MeteorとBurningエフェクトのテスト）
    const testCases = [
        {
            name: "Meteor Effect Test",
            bg: 1,      // Background ID
            monster: 1,  // Monster ID  
            item: 1,     // Item ID
            effect: 3    // Meteor effect
        },
        {
            name: "Burning Effect Test", 
            bg: 2,
            monster: 2,
            item: 2,
            effect: 8    // Burning effect
        }
    ];
    
    const composer = await hre.ethers.getContractAt("ArweaveTragedyComposer", composerAddress);
    
    for (const test of testCases) {
        console.log(`\n=== ${test.name} ===`);
        console.log(`Parameters: BG=${test.bg}, Monster=${test.monster}, Item=${test.item}, Effect=${test.effect}`);
        
        try {
            // SVGを生成
            const svg = await composer.composeSVG(test.bg, test.monster, test.item, test.effect);
            
            // 新しいエフェクトURLが含まれているか確認
            const meteorCheck = svg.includes("qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE");
            const burningCheck = svg.includes("pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA");
            
            if (test.effect === 3) {
                console.log("Meteor URL found in SVG:", meteorCheck ? "✅" : "❌");
            } else if (test.effect === 8) {
                console.log("Burning URL found in SVG:", burningCheck ? "✅" : "❌");
            }
            
            // SVGの一部を表示（エフェクト部分）
            const effectMatch = svg.match(/<image[^>]*href="[^"]*arweave\.net[^"]*"[^>]*>/g);
            if (effectMatch) {
                console.log("\nEffect image tag found:");
                effectMatch.forEach(tag => {
                    if (tag.includes("qMxaHOR") || tag.includes("pQ8Vd7L")) {
                        console.log("  ", tag);
                    }
                });
            }
            
            // Base64エンコードされたSVGデータURIを作成
            const svgBase64 = Buffer.from(svg).toString('base64');
            const dataUri = `data:image/svg+xml;base64,${svgBase64}`;
            
            console.log("\nSVG Data URI (first 100 chars):", dataUri.substring(0, 100) + "...");
            console.log("Full Data URI length:", dataUri.length);
            
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    console.log("\n\n=== エフェクトURL直接確認 ===");
    console.log("Meteor: https://arweave.net/qMxaHOR-v_PojOK-fFGVe32k_wPyWmyacyhoUTjvUTE");
    console.log("Burning: https://arweave.net/pQ8Vd7LVqQIBKSbAOoq26rqKKggxF-qAsSyZfwU_ZgA");
    console.log("\nこれらのURLをブラウザで開いて、新しいエフェクト画像が表示されることを確認してください。");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });