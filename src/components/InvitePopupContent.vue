<template>
    <div class="popup_content">
        <div class="switch_container">
            <div class="block_container">
                <div class="block_title">
                    <span class="left_icon blue"></span>
                    {{ $t('TeamProfile') }}
                </div>
                <div class="block_content">
                    <div class="block_item" v-for="(item, index) in teamProfile" :key="index">
                        <div class="name fc1">{{ item.name }}</div>
                        <div class="value ff fc2">{{ item.value }}</div>
                    </div>
                    <a href="#/" aria-current="page" class="btn lookDetail router-link-exact-active router-link-active">
                        {{ $t('TeamDetails') }}
                    </a>
                </div>
            </div>
        </div>
        <div class="share_content">
            <div class="popup_title">
                <div class="left_icon"></div>
                {{ $t('Sharefriends') }}
            </div>
            <div class="set_content">
                <div class="title fc1">{{ $t('Mysharelink') }}</div>
                <div class="content">
                    <div class="input">{{ inviteUrl }}</div>
                    <a class="btn submit" @click="copyLink">{{ $t('Copy') }}</a>
                </div>
                <div class="tips fc1">
                    <p>
                        {{ $t('Sendyourinvitationlink') }}
                    </p>
                    <table class="ui-table ui-table-border">
                        <thead>
                            <tr>
                                <th width="30%">{{ $t('Level') }}</th>
                                <th width="35%">{{ $t('interval') }}</th>
                                <th width="35%">{{ $t('Rebate') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in rebateInfo" :key="index">
                                <td>{{ item.level }}</td>
                                <td>{{ item.interval }}</td>
                                <td>
                                    <div style="text-align: left; padding-left: 25px;">
                                        Lev1: {{ item.lev1 }}<br />
                                        Lev2: {{ item.lev2 }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = defineProps({
    inviteUrl: {
        type: String,
        required: true,
        default: ""
    },
    teamData: {
        type: Object
    }
});

const teamProfile = ref([
    { name: t('Numberofteams'), value: props.teamData?.level1Num + props.teamData?.level2Num + props.teamData?.level3Num },
    { name: t('Teamcommission'), value: formatNumber(props.teamData?.level1 + props.teamData?.level2 + props.teamData?.level3) + " USDT" },
    // { name: t('Yesterdayscommission'), value: '0.00USDT' },
    { name: t('level1'), value: props.teamData?.level1Num + '/' + formatNumber(props.teamData?.level1) + ' USDT' },
    { name: t('level2'), value: props.teamData?.level2Num + '/' + formatNumber(props.teamData?.level2) + ' USDT' },
]);
function formatNumber(number, decimalPlaces = 2) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
    return formatter.format(number);
}
const shareLink = ref('https://trustsvip.top/#/?invite=GVH92227');

const rebateInfo = ref([
    { level: 'VIP1', interval: '1-1000', lev1: '13.00%', lev2: '3.00%' },
    { level: 'VIP2', interval: '1001-10000', lev1: '13.00%', lev2: '3.00%' },
    { level: 'VIP3', interval: '10001-50000', lev1: '13.00%', lev2: '3.00%' },
    { level: 'VIP4', interval: '50001-100000', lev1: '13.00%', lev2: '3.00%' },
    { level: 'VIP5', interval: '100001above', lev1: '13.00%', lev2: '3.00%' },
]);

const copyLink = () => {
    navigator.clipboard.writeText(props.inviteUrl);
    showToast(t('CopySuccess'));
};
</script>

<style scoped>
.ui-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center
}

.ui-table td,
.ui-table th {
    line-height: 1.4;
    padding: 1.33333vw
}

.ui-table.ui-table-border {
    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7
}

.ui-table.ui-table-border td,
.ui-table.ui-table-border th {
    border-bottom: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7
}

.ui-table.ui-table-border th {
    background: #f2f2f2
}

.invite-popup .switch_container .block_container {
    margin-top: 8vw;
    background: #fff;
    box-shadow: 1.6vw 3.2vw 5.33333vw 0 rgba(0, 0, 0, .05);
    border-radius: 4vw;
    padding: 2.13333vw 4.26667vw 5.86667vw
}

.invite-popup .switch_container .block_container .block_title {
    position: relative;
    color: #282c3c;
    font-size: 4.8vw;
    font-weight: 700;
    height: 6.66667vw;
    line-height: 6.66667vw
}

.invite-popup .switch_container .block_container .block_title .left_icon {
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

.invite-popup .switch_container .block_container .block_title .left_icon.blue {
    background: linear-gradient(1turn, rgba(90, 71, 217, .09), #71a8e0)
}

.invite-popup .switch_container .block_container .block_title .left_icon.red {
    background: linear-gradient(1turn, rgba(248, 164, 164, .2), #e1506a)
}

/* 在这里添加你的样式 */
.invite-popup .popup_content {
    position: relative;
    padding: 4.26667vw;
    box-sizing: border-box
}

.invite-popup .popup_title {
    position: relative;
    color: #282c3c;
    font-size: 4.8vw;
    font-weight: 700;
    height: 6.66667vw;
    line-height: 6.66667vw
}

.invite-popup .left_icon {
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

.invite-popup .bg {
    margin: 14.93333vw auto 0;
    width: 70.93333vw;
    height: 42.13333vw;
    background: url(../../assets/img/invite_bg.6f000622.png) 50% 50% no-repeat;
    background-size: contain
}

.invite-popup .switch_container {
    /* margin: 0 -4.26667vw */
    padding-bottom: 6.66667vw;
}

.invite-popup .share_content {
    margin: 0 auto;
    padding: 2.4vw 4.26667vw 6.66667vw;
    background: #fff;
    box-shadow: 1.6vw 3.2vw 5.33333vw 0 rgba(0, 0, 0, .05);
    border-radius: 4vw
}

.invite-popup .set_content {
    margin-top: 4.53333vw;
    padding-top: 3.46667vw;
    border-top: 1px solid hsla(0, 0%, 59.2%, .13)
}

.invite-popup .fc1,
.invite-popup .promotion-body {
    color: #a1a1b3
}

.invite-popup .content {
    margin-top: 2.66667vw;
    padding: 3.46667vw 3.2vw;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 1.6vw 3.2vw 5.33333vw 0 rgba(0, 0, 0, .05);
    border-radius: 1.33333vw;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center
}

.invite-popup .input {
    width: 57.33333vw;
    font-size: 3.2vw;
    color: #a1a1b3;
    word-break: break-all;
    word-wrap: break-word
}

.invite-popup .submit {
    position: relative;
    padding: 0 4vw;
    height: 6.4vw;
    line-height: 6.4vw;
    background: #ff8517;
    border-radius: 1.33333vw;
    font-size: 2.93333vw;
    color: #fff;
    transition: all .5s ease
}

.invite-popup .submit:active {
    top: .8vw
}

.invite-popup .lookDetail {
    display: block;
    position: relative;
    background: #ff8517;
    border-radius: 1.33333vw;
    font-size: 2.93333vw;
    width: 100%;
    height: 9.33333vw;
    margin-top: 4vw;
    color: #fff;
    text-align: center;
    padding-top: 2.13333vw;
    transition: all .5s ease
}

.invite-popup .lookDetail:active {
    top: 1px
}

.invite-popup z .tips {
    margin-top: 3.2vw;
    font-size: 2.93333vw;
    color: #a1a1b3
}

.invite-popup .tips p {
    line-height: 1.8;
    margin: 0
}
</style>