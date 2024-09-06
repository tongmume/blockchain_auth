<template>
  <div class="switch_container">
    <div class="switch_actions">
      <div class="switch_item" :class="{ active: currentTab === 0 }" @click="currentTab = 0">{{ $t('MiningPool') }}
      </div>
      <div class="switch_item" :class="{ active: currentTab === 1 }" @click="changeAccount">{{ $t('MyAccount') }}</div>
    </div>
    <div v-if="currentTab === 0">
      <BlockContainer :data="blockData" :items="items" />
      <HelpContainer :vipInfos="vipInfos" />
      <PartnerContainer />
    </div>
    <div v-else>
      <AccountDetails :walletBalance="balance + ''" :accountDetails="accountDetails" @confirm="onConfirm"
        :wrecords="wrecords" />
    </div>
  </div>
</template>

<script setup>
import BlockContainer from './infos/BlockContainer.vue';
import HelpContainer from './infos/HelpContainer.vue';
import PartnerContainer from './infos/PartnerContainer.vue';
import AccountDetails from './infos/AccountDetails.vue'

import { ref } from 'vue'
const currentTab = ref(0);
const props = defineProps({
  blockData: {
    type: Object,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  balance: {
    type: Number,    // 设置类型为 Number
    required: true,  // 如果是必填属性
    default: 0
  },
  vipInfos: {
    type: Array,
    required: false,
    default: () => [],
  },
  accountDetails: {
    type: Object,
    required: false,
  },
  hadAccount: {
    type: Object,
    required: false,
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

function changeAccount() {
  if (props.hadAccount && props.accountDetails) {
    currentTab.value = 1
  }
}
</script>

<style scoped>
/* Add relevant styles here */
.switch_container {
  margin-top: 6.66667vw;
  padding: 0 4.26667vw;
  padding-bottom: 6.66667vw
}

.switch_container .switch_actions {
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: flex-end;
  padding-bottom: 1.86667vw;
  font-size: 4.26667vw;
  font-weight: 700;
  color: #a1a1b3;
  border-bottom: 1px solid #ebedf3
}

.switch_container .switch_actions .switch_item {
  width: 33.3%;
  text-align: center;
  white-space: nowrap
}

.switch_container .switch_actions .switch_item.active {
  position: relative;
  color: #282c3c;
  font-size: 4.66667vw
}

.switch_container .switch_actions .switch_item.active:after {
  position: absolute;
  bottom: -1.86667vw;
  left: 0;
  right: 0;
  margin: auto;
  content: "";
  width: 13.33333vw;
  height: 1.06667vw;
  background: #6660b1
}
</style>