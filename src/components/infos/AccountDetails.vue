<template>
    <div>
        <!-- 账户信息块 -->
        <div class="block_container">
            <div class="block_title">
                <span class="left_icon blue"></span>
                {{ $t('MyAccount') }}
            </div>
            <div class="block_content">
                <div class="block_item" v-for="(item, index) in accountItems" :key="index">
                    <div class="name fc1">{{ item.name }}</div>
                    <div class="value ff fc2">{{ item.value }}</div>
                </div>
            </div>
        </div>

        <!-- 操作选项卡 -->
        <div class="action_tabs">
            <div class="action_item" :class="{ active: activeTab === 'withdraw' }" @click="setActiveTab('withdraw')">
                {{ t('Withdraw') }}</div>
            <div class="action_item" :class="{ active: activeTab === 'record' }" @click="setActiveTab('record')">
                {{ t('Record') }}
            </div>
        </div>

        <!-- 提现表单 -->
        <form v-if="activeTab === 'withdraw'" class="action_container van-form">
            <div class="action_title">
                <span class="left_icon"></span>
                {{ $t('Withdraw') }}
            </div>
            <div class="action_content">
                <div class="cash_out_content">
                    <van-field class="change_input ff" type="number" v-model="inputValue" placeholder="0" />
                    <span class="divider"></span>
                    <div class="usdt_content">
                        <img src="@/assets/img/usdticon.png" class="usdt_icon" />
                        <span>USDT</span>
                    </div>
                </div>
                <span class="change_all" @click="setFullBalance">{{ $t('TotalBalance') }}</span>
            </div>
            <van-button class="change_btn bc1" @click="confirmWithdraw">{{ $t('confirm') }}</van-button>
            <div class="tips">
                <div class="limitcnt fc1">{{ $t('Dailywithdrawals', { money: 1 }) }}</div>
            </div>
        </form>

        <!-- 记录列表 -->
        <div v-if="activeTab === 'record'" class="action_container">
            <!-- <div class="record_tabs">
                <div class="record_item" :class="{ active: recordTab === 'withdraw' }"
                    @click="setRecordTab('withdraw')">
                    {{ $t('Withdraw') }}</div>
                <div class="record_item" :class="{ active: recordTab === 'output' }" @click="setRecordTab('output')">
                    {{ $t('Output') }}</div>
                <div class="record_item" :class="{ active: recordTab === 'reward' }" @click="setRecordTab('reward')">
                    {{ $t('Reward') }}</div>
            </div> -->
            <div class="record_list">
                <div class="record_title">
                    <div class="title_item" style="width: 33%;">{{ t('Time') }}</div>
                    <div class="title_item" style="width: 33%;">{{ t('Quantity') }}</div>
                    <div class="title_item" style="width: 33%;">{{ t('Status') }}</div>
                </div>
                <div class="list_content">
                    <ul v-if="wrecords.length" class="has_data">
                        <li class="data-item" v-for="item in wrecords">
                            <span class="time" style="line-height: 1;">{{ formatterdate(item.time) }}</span>
                            <span class="quantity">{{ formatNumber(item.usdt) }}</span>
                            <span class="status">{{ formatterstatus(item.status) }}</span>
                        </li>
                    </ul>
                    <div v-else class="no_data">
                        <img src="@/assets/img/nodata_icon.svg" />
                        <div>{{ t('NoData') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    walletBalance: {
        type: String,
        required: true
    },
    accountDetails: {
        type: Object,
        required: true,
        default: null
    },
    onConfirm: {
        type: Function,
        required: true
    },
    wrecords: {
        type: Array
    }
});

const formatterdate = (time) => {
    const date = new Date(time);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
}
const formatterstatus = (status) => {
    let strs = [t('Processing'), t('Successful'), t('Fail')];
    return strs[status];
}
function formatNumber(number, decimalPlaces = 2) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
    return formatter.format(number);
}
const inputValue = ref('');
// 点击确认按钮时调用父组件传入的 confirm 方法
function confirmWithdraw() {
    props.onConfirm(inputValue.value);
}
// 点击 change_all 按钮时，将余额显示到输入框中
function setFullBalance() {
    inputValue.value = props.accountDetails.canExtract;
}
// 账户信息
const accountItems = [
    { name: t('TotalOutput'), value: formatToSixDecimal(props.accountDetails.ethAll) + ' USDT' },
    { name: t('YesterdayOutput'), value: formatToSixDecimal(props.accountDetails.usdtHold) + ' USDT' },
    { name: t('WalletBalance'), value: props.accountDetails.usdt + ' USDT' },
    // { name: 'Hash Aid', value: '0.000000 USDT' },
    { name: t('Totalparticipation'), value: props.accountDetails.usdt + ' USDT' },
    { name: t('Withdrawable'), value: formatToSixDecimal(props.accountDetails.canExtract) + ' USDT' }
];
function formatToSixDecimal(number) {
    return number.toFixed(6);
}
// 活动标签和记录标签
const activeTab = ref('withdraw');
const recordTab = ref('withdraw');

// 设置活动标签
const setActiveTab = (tab) => {
    activeTab.value = tab;
};

// 设置记录标签
const setRecordTab = (tab) => {
    recordTab.value = tab;
};
</script>

<style scoped>
.has_data {
    height: 100px;
    overflow: auto;
}

.has_data .data-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    line-height: 8vw
}

.has_data .data-item span {
    display: block;
    text-align: center;
    flex: 1
}

.bc1,
.bc2 {
    background: #6660b1;
}

.block_container {
    margin-top: 8vw;
    background: #fff;
    box-shadow: 1.6vw 3.2vw 5.33333vw 0 rgba(0, 0, 0, .05);
    border-radius: 4vw;
    padding: 2.13333vw 4.26667vw 5.86667vw
}

.block_container .block_title {
    position: relative;
    color: #282c3c;
    font-size: 4.8vw;
    font-weight: 700;
    height: 6.66667vw;
    line-height: 6.66667vw
}

.block_container .block_title .left_icon {
    display: inline-block;
    position: absolute;
    top: 0;
    left: -4.26667vw;
    bottom: 0;
    margin: auto;
    width: 1.06667vw;
    height: 5.33333vw;
    border-radius: .53333vw
}

.block_container .block_title .left_icon.blue {
    background: linear-gradient(1turn, rgba(90, 71, 217, .09), #71a8e0)
}

.block_container .block_title .left_icon.red {
    background: linear-gradient(1turn, rgba(248, 164, 164, .2), #e1506a)
}

/* 在此处添加样式 */
.action_tabs {
    margin-top: 6.4vw;
    display: flex;
    justify-content: space-between
}

.action_tabs .action_item {
    flex: 1;
    width: 29.33333vw;
    height: 9.06667vw;
    line-height: 9.06667vw;
    background: rgba(217, 231, 250, .48);
    border-radius: 2.4vw 2.4vw 0 0;
    color: #000;
    text-align: center
}

.action_tabs .action_item.active {
    color: #fff;
    background: #6660b1
}

.action_container {
    background: #fff;
    box-shadow: 1.6vw 3.2vw 5.33333vw 0 rgba(0, 0, 0, .05);
    border-radius: 0 0 4vw 4vw;
    padding: 4.26667vw 2.13333vw 5.86667vw
}

.action_container .action_title {
    position: relative;
    color: #282c3c;
    font-size: 4.8vw;
    font-weight: 700;
    height: 6.66667vw;
    line-height: 6.66667vw
}

.action_container .action_title .left_icon {
    display: inline-block;
    position: absolute;
    top: 0;
    left: -4.26667vw;
    bottom: 0;
    margin: auto;
    width: 1.06667vw;
    height: 5.33333vw;
    border-radius: .53333vw;
    background: linear-gradient(1turn, rgba(90, 71, 217, .09), #71a8e0)
}

.action_container .action_content {
    position: relative;
    margin-top: 3.2vw;
    padding: 4.26667vw 4.26667vw 5.6vw;
    border-radius: 4vw;
    border: 1px solid #ebedf3
}

.action_container .action_content .change_content {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center
}

.action_container .action_content .change_content .change_icon {
    width: 11.73333vw
}

.action_container .action_content .change_content .usdt_content {
    width: 31.2vw;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center
}

.action_container .action_content .change_content .usdt_content .usdt_icon {
    margin-right: 3.2vw;
    width: 5.86667vw;
    height: 5.86667vw
}

.action_container .action_content .cash_out_content {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center
}

.action_container .action_content .cash_out_content .change_input,
.action_container .action_content .change_content .change_input {
    flex: 2;
    width: 31.2vw;
    font-size: 7.46667vw;
    border: 0;
    border: none;
    outline: none;
    background-color: transparent;
    height: 8.26667vw;
    padding: 0
}

.action_container .action_content .cash_out_content .change_input:after,
.action_container .action_content .change_content .change_input:after {
    display: none
}

.action_container .action_content .cash_out_content .divider {
    width: 1px;
    height: 11.73333vw;
    background: #ebedf3
}

.action_container .action_content .cash_out_content .usdt_content {
    padding-right: 1.6vw;
    width: 29.33333vw;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
    flex: 1
}

.action_container .action_content .cash_out_content .usdt_content .usdt_icon {
    margin-right: 3.2vw;
    width: 5.86667vw;
    height: 5.86667vw
}

.action_container .action_content .change_all {
    position: absolute;
    color: #2082fe;
    font-size: 3.2vw;
    left: 4.26667vw;
    bottom: 1.6vw
}

.action_container .change_btn {
    margin: 0 auto;
    margin-top: 6.66667vw;
    display: block;
    width: 48.8vw;
    height: 10.66667vw;
    line-height: 10.66667vw;
    text-align: center;
    color: #fff;
    font-size: 4.26667vw;
    font-weight: 700;
    border-radius: 1.33333vw
}

.action_container .tips {
    margin-top: 5.33333vw;
    padding-top: 3.2vw;
    border-top: 1px solid rgba(235, 237, 243, .4);
    font-size: 2.93333vw
}

.action_container .record_tabs {
    display: flex;
    justify-content: center
}

.action_container .record_tabs .record_item {
    height: 8vw;
    line-height: 8vw;
    padding: 0 6.66667vw;
    border: 1px solid #6660b1
}

.action_container .record_tabs .record_item:first-child {
    border-radius: 1.6vw 0 0 1.6vw;
    border-right: none
}

.action_container .record_tabs .record_item:last-child {
    border-radius: 0 1.6vw 1.6vw 0;
    border-left: none
}

.action_container .record_tabs .record_item.active {
    background: #6660b1;
    color: #fff
}

.action_container .record_list {
    margin-top: 6.66667vw
}

.action_container .record_list .record_title {
    display: flex;
    justify-content: space-between
}

.action_container .record_list .title_item {
    text-align: center
}

.action_container .record_list .title_item:first-child {
    width: 40%
}

.action_container .list_content {
    margin-top: 3.2vw;
    color: #a1a1b3
}

.action_container .list_content .record_list_content {
    display: flex;
    justify-content: space-between
}

.action_container .list_content .record_list_content.exchane_record_content .content_item:first-child {
    width: 45%
}

.action_container .list_content .record_list_content .content_item {
    text-align: center;
    padding: 2vw 0;
    word-wrap: break-word;
    word-break: normal
}

.action_container .list_content .record_list_content .content_item:first-child {
    width: 40%
}

.has_data .data-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    line-height: 8vw
}

.has_data .data-item span {
    display: block;
    text-align: center;
    flex: 1
}

.action_container .list_content .no_data {
    text-align: center
}

.action_container .list_content .no_data img {
    margin: 1.33333vw 0;
    width: 25.06667vw
}
</style>