/**
 * 格式化钱包地址为简洁的显示形式
 * @param {string} fullAddress - 完整的钱包地址
 * @param {number} startLength - 保留的前缀长度
 * @param {number} endLength - 保留的后缀长度
 * @returns {string} - 格式化后的钱包地址
 */
export function formatWalletAddress(fullAddress, startLength = 0, endLength = 4) {
    // 确保地址是有效的
    if (!fullAddress || fullAddress.length < (startLength + endLength + 2) || !/^0x[a-fA-F0-9]+$/.test(fullAddress)) {
        return fullAddress;
    }
    // 提取前缀和后缀部分
    const prefix = fullAddress.substring(0, startLength + 2); // +2 for '0x'
    const suffix = fullAddress.substring(fullAddress.length - endLength);

    // 构建格式化后的地址
    return `${prefix}......${suffix}`;
}

function isTronAvailable() {
    return !!window.tronWeb;
}

function isEthereumAvailable() {
    return !!window.ethereum;
}

function isChromeBrowser() {
    // Check if the browser is Google Chrome
    const userAgent = window.navigator.userAgent;
    const vendor = window.navigator.vendor;
    // Check for Chrome and exclude other Chromium-based browsers like Edge
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(vendor);
    const isEdge = /Edg/.test(userAgent); // Exclude Edge browser
    // 判断是否为 iOS 设备上的 Chrome 浏览器
    const isChromeOnIOS = /CriOS/.test(userAgent);
    return (isChrome && !isEdge) || isChromeOnIOS;
}

export function getEnvironment() {
    const isETH = isEthereumAvailable();
    const isTRX = isTronAvailable();
    const isChrome = isChromeBrowser();
    return {
        isETH: isETH,
        isTRX: isTRX,
        inWallet: isETH || isTRX,
        isChrome: isChrome
    };
}