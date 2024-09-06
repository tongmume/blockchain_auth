<template>
    <div class="float-menu-wrap">
        <div class="float-menu" ref="floatMenuRef" :draggable="true" :style="menuStyle" @click="toggleMenu" @dragstart="onDragStart"
            @drag="onDrag" @dragend="onDragEnd"></div>
        <div class="mask" :style="'display:' + (isShow ? '' : 'none')" @click="isShow = false"></div>
        <transition name="slide">
            <span v-if="isShow" class="menu-navs"
                :style="{ top: `${navsPosition.top}px`, right: `${navsPosition.right}px` }">
                <a data-index="0" :href="props.serviceUrl" target="_blank" class="menu-nav">
                    <i class="icon icon-tg"></i>
                </a>
            </span>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const floatMenuRef = ref(null); // 获取 float-menu 的引用
const props = defineProps({
    serviceUrl: {
        type: String,
        default: ''
    }
});

import floatMenuImage from '@/assets/img/service.jpg';

const currentPosition = ref({ left: window.innerWidth - 100, top: 0 }); // 默认初始位置
const menuStyle = ref({
    backgroundImage: `url(${floatMenuImage})`,
    touchAction: 'none',
    position: 'fixed',
    right: '0px', // 将菜单固定在右侧
    top: `${currentPosition.value.top}px`, // 初始 top
});

const navsPosition = ref({ right: 0, top: 0 });
const isShow = ref(false);

const updateNavsPosition = () => {
    const floatMenuWidth = floatMenuRef.value.offsetWidth;
    navsPosition.value = {
        right: floatMenuWidth, // 通过计算 right 属性来确定位置
        top: currentPosition.value.top
    };
};

const toggleMenu = () => {
    if (props.serviceUrl) {
        isShow.value = !isShow.value;
    }
};

const onDragStart = (event) => {
    event.dataTransfer.setData('text/plain', '');
};

const onDrag = (event) => {
    if (event.clientX > 0 && event.clientY > 0) {
        currentPosition.value = {
            left: event.clientX - event.target.offsetWidth / 2,
            top: event.clientY - event.target.offsetHeight / 2,
        };
        updateMenuStyle();
    }
};

const onDragEnd = () => {
    // Handle drag end if needed
    updateNavsPosition(); // 拖动结束时更新 menu-navs 的位置
};

const updateMenuStyle = () => {
    menuStyle.value = {
        ...menuStyle.value,
        left: `${currentPosition.value.left}px`,
        top: `${currentPosition.value.top}px`,
    };
};

// 计算初始位置，使其在纵向居中
onMounted(() => {
    const windowHeight = window.innerHeight;
    const menuHeight = 100; // 假设 float-menu 的高度是 100px
    currentPosition.value.top = (windowHeight - menuHeight) / 2;
    menuStyle.value.top = `${currentPosition.value.top}px`;
    updateNavsPosition(); // 初始化时更新 menu-navs 的位置
});

watch(currentPosition, updateNavsPosition); // 监听 currentPosition 的变化
</script>

<style scoped>
.float-menu-wrap {
    position: fixed;
    z-index: 100
}

.float-menu-wrap .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0
}

.float-menu-wrap .float-menu {
    --size: 10.66667vw;
    display: inline-block;
    vertical-align: middle;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: #ddd;
    background-size: 100% 100%;
    box-shadow: 0 0 1.06667vw rgba(0, 0, 0, .5);
    background-image: url(data:image/jpeg;base64,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)
}

.float-menu-wrap .menu-navs {
    position: fixed
}

.float-menu-wrap .menu-nav {
    --size: 10.66667vw;
    display: inline-block;
    vertical-align: middle;
    margin: 0 1.33333vw 1.33333vw;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);
    background: #fff;
    line-height: var(--size);
    color: #fff;
    text-align: center;
    transition: all .5s cubic-bezier(.39, 1.52, .46, .92);
    box-shadow: 0 0 1.06667vw rgba(0, 0, 0, .5)
}

.float-menu-wrap .iconfont {
    font-size: 6.66667vw
}

.float-menu-wrap .icon {
    display: block;
    width: 10.66667vw;
    height: 10.66667vw;
    font-size: 6.66667vw;
    border-radius: 100% 100%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain
}

.float-menu-wrap .icon-tg {
    background-image: url(@/assets/img/tg.png)
}

.float-menu-wrap .icon-online {
    background-image: url(../../assets/img/online.0bb9c38d.png)
}

.float-menu-wrap .icon-whatsapp {
    background-image: url(../../assets/img/whatsapp.e6817a36.png)
}

.float-menu-wrap .slide-fade-enter,
.float-menu-wrap .slide-fade-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
}

/* Animation styles */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-enter-to {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>