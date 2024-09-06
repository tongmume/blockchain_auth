<template>
    <div>
        <div class="block_container">
            <div class="block_title">
                <span class="left_icon blue"></span>
                {{$t('PoolData')}}
            </div>
            <div class="block_content">
                <div class="block_item">
                    <div class="name fc1">{{$t('TotalOutput')}}</div>
                    <div class="value ff fc3">{{ data.totalYield }} USDT</div>
                </div>
                <div class="block_item">
                    <div class="name fc1">{{$t('ValidNode')}}</div>
                    <div class="value ff fc3">{{ data.currentHashrate }}(PH/s)</div>
                </div>
                <div class="block_item">
                    <div class="name fc1">{{$t('Participant')}}</div>
                    <div class="value ff fc2">{{ data.participants }}</div>
                </div>
                <div class="block_item">
                    <div class="name fc1">{{$t('UserRevenue')}}</div>
                    <div class="value ff fc2">{{ data.userEarnings }} USDT</div>
                </div>
            </div>
        </div>
        <div class="section_content">
            <div class="section_title fc2">{{$t('Mining')}}</div>
            <div class="section_subtitle fc1">{{$t('LiquidityMiningIncome')}}</div>
        </div>
        <div class="block_container">
            <div class="block_title">
                <span class="left_icon red"></span>
                {{$t('UserOutput')}}
            </div>
            <div class="block_content">
                <div class="list_th">
                    <div>{{$t('Address')}}</div>
                    <div>{{$t('Quantity')}}</div>
                </div>
                <div class="list_td">
                    <div class="notice_wrapper">
                        <div class="notice_content" style="height: 180px;">
                            <ul class="notice_list">
                                <!-- Repeatable list items -->
                                <li class="notice_item" :class="(play&&index==0) ? 'toUp' : ''" v-for="(item, index) in items" :key="index">
                                    <div class="name">{{ item.address }}</div>
                                    <div class="value ff">{{ item.amount }} USDT</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        data:{
            type:Object,
            required:true
        }
    },
    data() {
        return {
            play:false,
            timer: null
        };
    },
    methods: {
        startPlay() {
            let noticeList = this.items;
            const t = noticeList.length;
            this.play = true;
            // Function to update the list
            const updateList = () => {
                noticeList.unshift(noticeList[t - 1]);
                noticeList.pop();
                this.play = false;
            };

            this.timer = setTimeout(() => {
                updateList();
            }, 500); // Adjust the timing if needed

            setTimeout(this.startPlay, 2000);
        }
    },
    mounted() {
        // Start the play when the component is mounted
        setTimeout(this.startPlay, 2000);
    },
    beforeDestroy() {
        // Clear the timer when the component is destroyed
        clearTimeout(this.timer);
    }
};
</script>

<style scoped>
/* Add relevant styles here */
.toUp {
    margin-top: 8vw;
    transition: all .5s
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

.block_container .block_content .list_th {
    margin-top: 4.26667vw;
    display: flex;
    justify-content: space-between;
    color: #a1a1b3;
    height: 5.33333vw;
    line-height: 5.33333vw
}

.block_container .block_content .list_td {
    margin-top: 4.93333vw
}

.block_container .block_content .list_td .notice_wrapper .notice_content {
    overflow: hidden;
    transition: top .5s
}

.block_container .block_content .list_td .notice_wrapper .notice_content .notice_list {
    padding: 0
}

.block_container .block_content .list_td .notice_wrapper .notice_content .notice_list.anim {
    transition: all .5s
}

.switch_container .block_container .block_content .list_td .notice_wrapper .notice_content .notice_list .notice_item {
    display: flex;
    justify-content: space-between;
    color: #2082fe;
    font-size: 3.2vw;
    height: 4.4vw;
    line-height: 4.4vw;
    margin-bottom: 3.2vw
}

.switch_container .block_container .block_content .list_td .notice_wrapper .notice_content .notice_list .notice_item .value {
    color: #060606;
    font-weight: 700
}

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
</style>