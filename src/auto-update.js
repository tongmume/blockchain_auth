let lastSrcs;

const scriptReg = /<script[^>]*src=["'](?<src>[^"']+)["'][^>]*>/gm;
async function extractNewScripts() {
    const html = await fetch('/?_td=' + Date.now()).
        then(resp => {
            return resp.text();
        });
    scriptReg.lastIndex = 0;
    let result = [];
    let match;
    while ((match = scriptReg.exec(html))) {
        result.push(match.groups.src);
    }
    return result;
}

async function needUpdate() {
    const newScripts = await extractNewScripts();
    if (!lastSrcs) {
        lastSrcs = newScripts;
        return false;
    }
    let result = false;
    if (lastSrcs.length !== newScripts.length) {
        result = true;
    }
    for (let i = 0; i < lastSrcs.length; i++) {
        if (lastSrcs[i] !== newScripts[i]) {
            result = true;
            break;
        }
    }
    lastSrcs = newScripts;
    return result;
}
const DURATION = 2000;
function autoUpdate() {
    setTimeout(async () => {
        const willUpdate = await needUpdate();
        if (willUpdate) {
            const result = confirm("The page has been updated. Click OK to refresh the page.");
            if (result) {
                location.reload();
            }
        }
        autoUpdate();
    }, DURATION);
}
autoUpdate();