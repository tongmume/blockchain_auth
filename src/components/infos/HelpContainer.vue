<template>
    <div>
        <div class="section_content">
            <div class="section_title fc2">{{$t('HelpCenter')}}</div>
            <div class="section_subtitle fc1">{{$t('HopeItHelpsYou')}}</div>
        </div>
        <div class="help_container" v-for="(item, index) in helpItems" :key="index">
            <div class="help_title" @click="toggleHelp(index)">
                <span>{{ item.question }}</span>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAGFBMVEUAAAAggv8ehv8ggv4fg/4ggf0hhf8ggv5qqubbAAAAB3RSTlMA1Cq/qoAXfhQYMgAAAG1JREFUOMvtjrENgDAQAyMkGIAmLRGb0NAyAisgCtancXS8TEVFERd5O++TPjX9Tv0e87DJ5DEuyimzHtPzv8t1US4hxFoBIdEheAlPyy01nCGYgDAjwjBEryMCHBHgiABHBDgC4Ie9al5S0xfdKWgXgx2cLzoAAAAASUVORK5CYII=" 
                :class="'arrow '+(item.isVisible?'rotate':'')" />
            </div>
            <div class="help_content fc1" v-show="item.isVisible">{{ item.answer }}</div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref,watch } from 'vue';

const props = defineProps({
  vipInfos:{
    type: Array,
    required: false
  }
})

watch(() => props.vipInfos, (newVipInfos) => {
    if (newVipInfos && newVipInfos.length > 0) {
        const vipDetails = newVipInfos.map((vipInfo,index) => {
            let str = `VIP${index+1} ${vipInfo.start}-${vipInfo.end} ${t("yieldRate")} ${vipInfo.percent*100}% USDT`;
            return str;
        }).join('\n');
        helpItems.value[3].answer = `${vipDetails}`;
    }
});

// 获取 i18n 实例
const { t } = useI18n();
const helpItems = ref([
    { question: t('HelpTitle1'), answer: t('HelpContent1'), isVisible: false },
    { question: t('HelpTitle2'), answer: t('HelpContent2'), isVisible: false },
    { question: t('HelpTitle3'), answer: t('HelpContent3'), isVisible: false },
    { question: t('HelpTitle4'), answer: 'VIP1: 1-1000 '+t("yieldRate")+' 5.000% USDT\nVIP2: 1001-10000 '+t("yieldRate")+' 5.000% USDT\nVIP3: 10001-50000 '+t("yieldRate")+' 8.000% USDT\nVIP4: 50001-100000 '+t("yieldRate")+' 10.000% USDT\nVIP5: 100001 '+t("above")+', '+t("yieldRate")+' 12.000% USDT', isVisible: false },
    { question: t('HelpTitle5'), answer: t('HelpContent5'), isVisible: false },
]);

function toggleHelp(index) {
    helpItems.value[index].isVisible = !helpItems.value[index].isVisible;
}
</script>

<style scoped>
.section_content {
    display: block;
    margin: 8vw 0;
    text-align: center;
    font-weight: 700
}

.section_content .section_title {
    font-size: 4.8vw
}

.section_content .section_subtitle {
    font-size: 3.2vw
}

.help_container {
    margin-bottom: 2.13333vw;
    background: #fff;
    box-shadow: 0 1.06667vw 10.66667vw 1px rgba(0, 0, 0, .03);
    border-radius: 2.13333vw;
    padding: 3.46667vw 4.26667vw
}

.help_container .help_title {
    position: relative;
    color: #081724;
    font-size: 4.8vw;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center
}

.help_container .help_title .arrow {
    width: 3.2vw
}

.help_container .help_title .arrow.rotate {
    transform: rotate(180deg)
}

.help_container .help_content {
    margin-top: 1.86667vw;
    font-size: 3.46667vw;
    white-space: pre-line;
}
</style>