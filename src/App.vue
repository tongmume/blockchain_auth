<script setup>
import { useUserStore } from '@/stores/userStore'; // 导入 store
import { modal} from '@/utils/web3'

import {ref} from 'vue'
const userStore = useUserStore();
const account = ref(userStore.account);
modal.subscribeProvider((n)=>{
  console.log(n.value);
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
