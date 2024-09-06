// src/stores/userStore.js
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import i18n from '@/i18n'; // 确保正确导入 i18n 实例
export const useUserStore = defineStore('user', {
    state: () => ({
        account: {
            address: '',
            isConnected: '',
            chainId: ''
        },
        language: useStorage('user-language', 'en-US'),
    }),
    actions: {
        setAccount(account) {
            this.account = account;
        },
        // 更新账户的某个属性
        updateAccountProperty(key, value) {
            if (this.account.hasOwnProperty(key)) {
                this.account[key] = value;
            }
        },
        // 清除账户信息
        clearAccount() {
            this.account = { id: '', username: '' };
        },
        setLanguage(lang) {
            this.language = lang; // 修改语言状态，会自动同步到 localStorage
            i18n.global.locale.value = lang;
            window.location.reload(); 
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user-language',
                storage: localStorage,
                paths: ['language'], // 仅持久化语言设置
            }
        ],
    },
});
