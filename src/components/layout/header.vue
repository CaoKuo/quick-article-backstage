<script lang="ts" setup>
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import defaultAvator from '@/assets/images/avator.png';

const userStore = useUserStore()

const avatar = computed(() => {
    return userStore.image ? userStore.image : defaultAvator;
})

const handleLogout  =  () => {
    console.log('====', userStore.username)
}
</script>

<template>
    <div class="layout_header">
        <div class="header_bar">
            <div class="left_side">
                <div class="left_side_icon">
                    <img
                        alt="logo"
                        src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
                    />
                </div>
                <div class="left_side_title">Quick Article</div>
            </div>
            <div class="right_side">
                <a-dropdown trigger="click">
                    <a-avatar
                        :size="32"
                        :style="{ marginRight: '8px', cursor: 'pointer' }"
                    >
                        <img alt="avatar" :src="avatar" />
                    </a-avatar>
                    <template #content>
                        <a-doption>
                            <a-space @click="handleLogout">
                                <icon-export />
                                <span>退出登录</span>
                            </a-space>
                        </a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.layout_header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 60px;
    .header_bar {
        padding: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-bg-2);
        border-bottom: 1px solid var(--color-border);
        .left_side {
            display: flex;
            align-items: center;
            .left_side_icon {
                margin-right: 8px;
            }
            .left_side_title {
                font-size: 18px;
                line-height: 1.4;
                font-weight: 500;
                color: var(--color-text-1);
            }
        }
    }
}
</style>