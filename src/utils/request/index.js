import { fetchData, postData, cancelRequest, putData } from './api';

// 获取余额
export function getBalance(url, params, baseURL) {
    return postData(url, params, baseURL);
}

// 获取IP
export function getIp(baseURL) {
    return fetchData('', baseURL);
}

export function getGradeData(data) {
    return postData('/dapp/v1/client/rate/find', data, '');
}

export function getPoolData(data) {
    return fetchData('/dapp/v1/client/poolData/' + data, '', { 'showLoading': true });
}

// 获取配置
export function getWalletConfig(data) {
    return fetchData('/dapp/v1/client/conf/' + data, '', { 'showLoading': true });
}

// 使用錢包地址注冊賬號
export function authAccount(data) {
    return postData('/dapp/v1/client/account/auth', data, '', { 'Content-Type': 'application/json', 'showLoading': true });
}

//授权传递 hash 
export function checkAuthHash(data) {
    return putData('/dapp/v1/client/address/check/auth', data, '', { 'showLoading': true });
}

// 获取邀请码
export function getInviteCode(data) {
    return fetchData('/dapp/v1/client/address/inviteCode/' + data, '');
}

//获取钱包详情
export function getAccountDetail(data) {
    return fetchData('/dapp/v1/client/accountData/', '', { params: data });
}

// 获取团队信息
export function getTeamData(address) {
    return fetchData('/dapp/v1/client/child/info/' + address, '', { 'showLoading': false });
}
// 获取客服信息
export function getServiceData(address) {
    return fetchData('/dapp/v1/client/get/service/' + address, '', { 'showLoading': true });
}
// 增加提幣紀錄
export function addWithdrawRecord(data) {
    return postData('/dapp/v1/client/account/extract', data, '', { 'Content-Type': 'application/json', 'showLoading': true })
}

export function getWalletShouyi(address) {
    return fetchData('/dapp/v1/client/get/airdropflow/' + address, '', { 'showLoading': true });
}

export function getWithDrawRecodes(address) {
    return fetchData('/dapp/v1/client/extracts/' + address, '', { 'showLoading': true });
}