<template>
    <div class="section_content">
        <div class="section_title fc2">{{$t('Partner')}}</div>
        <div class="section_subtitle fc1">{{$t('OurBusinessPartner')}}</div>
    </div>
    <div class="partner_container">
        <div class="partner_content">
            <a :href="partner.url" target="_blank" class="partner_item"  v-for="(partner, index) in partners" :key="index">
                <img :src="getImageUrl(partner.image)" />
            </a>
        </div>
        <div class="partner_content">
            <a :href="partner.url" target="_blank" class="partner_item"  v-for="(partner, index) in partners2" :key="index">
                <img :src="getImageUrl(partner.image)" />
            </a>
        </div>
    </div>
</template>

<script setup>
const partners = [
    { url: 'https://www.hecochain.com', image: 'bottom_icon4.png' },
    { url: 'https://www.coingecko.com', image: 'bottom_icon5.png' },
    { url: 'https://www.binance.com', image: 'bottom_icon6.png' },
];
const partners2 = [
    { url: 'https://defibox.io', image: 'bottom_icon101.png' },
    { url: 'https://www.kucoin.com', image: 'bottom_icon81.png' },
    { url: 'https://www.tokenpocket.pro/', image: 'bottom_icon9.png' },
];
function getImageUrl(imageName) {
    // Dynamically generate the URL for the image
    return new URL(`../../assets/img/${imageName}`, import.meta.url).href;
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

.partner_container {
    margin-top: 8vw
}

.partner_container .partner_content {
    margin-top: 5.33333vw;
    display: flex;
    justify-content: space-between
}

.partner_container .partner_content .partner_item {
    display: block;
    width: 26.66667vw;
    height: 9.6vw;
    background: #d8d8d8;
    border-radius: 1.33333vw;
    overflow: hidden
}

.partner_container .partner_content .partner_item img {
    width: 100%;
    height: 100%
}
</style>