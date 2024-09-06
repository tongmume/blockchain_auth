import { createI18n } from 'vue-i18n';

// 导入语言包
import en from './locales/en-US';
import ar from './locales/ar-AE';
import de from './locales/de-DE';
import id from './locales/en-ID';
import fr from './locales/fr-FR';
import it from './locales/it-IT';
import ja from './locales/ja-JP';
import ko from './locales/ko-KR';
import pt from './locales/pt-BR';
import ru from './locales/ru-RU';
import th from './locales/th-th';
import tr from './locales/tr-TR';
import vi from './locales/vi-VN';
import zh from './locales/zh-CHT';

// 从本地存储获取已保存的语言设置，若无则使用 'en-US'
const savedLanguage = localStorage.getItem('user-language') || 'en-US';

// 创建 i18n 实例
const i18n = createI18n({
    legacy: false,
    locale: savedLanguage, // 默认语言
    fallbackLocale: 'en-US', // 默认语言
    messages: {
        'en-US':en,
        'ar-AE':ar,
        // 'de-DE':de,
        'en-ID':id,
        'fr-FR':fr,
        'it-IT':it,
        'ja-JP':ja,
        'ko-KR':ko,
        'pt-BR':pt,
        'ru-RU':ru,
        'th-th':th,
        'tr-TR':tr,
        'vi-VN':vi,
        'zh-CHT':zh
    },
});

export default i18n;
