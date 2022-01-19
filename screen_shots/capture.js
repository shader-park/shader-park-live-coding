const puppeteer = require('puppeteer');
const fs = require('fs');

let rawdata = fs.readFileSync('./filePaths1.json');
let filePaths = JSON.parse(rawdata);

const CAPTURE_FOLDER_PATH = './cap2'

async function runBrowser(browserI, n, newFilePaths) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            // "--use-cmd-decoder=passthrough",
        ]
        // args: [
        //     '--use-gl=egl'
        // ]
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1200,
        deviceScaleFactor: 1,
    });
    for (let i = 0; i < n; i++) {
        await page.goto("http://localhost:1234");
        await page.waitForTimeout(200);
        let hash = await page.evaluate(()=> fxhash);
        console.log(hash);
        // await page.waitForTimeout(5000 * 1000);
        await page.screenshot({ path:  `${CAPTURE_FOLDER_PATH}/${hash}.png` });
        newFilePaths.push(`${CAPTURE_FOLDER_PATH}/${hash}.png`);
    }

    await browser.close();
}


(async () => {
    console.time("run");
    let promises = [];
    let newFilePaths = []
    for (let i = 0; i < 5; i++) {
        promises.push(runBrowser(i, 2, newFilePaths));
    }
    await Promise.all(promises);
    let finalPaths = newFilePaths.concat(filePaths);
    let data = JSON.stringify(finalPaths);
    fs.writeFileSync('./filePaths1.json', data);
    console.timeEnd("run");
})();