<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import layoutHeader from '@/components/layout/header.vue';
import layoutMenu from '@/components/layout/menu.vue';

const userStore = useUserStore();

userStore.getUserInfo();
</script>

<template>
    <div class="layout">
        <layout-header />
        <div class="layout_container">
            <layout-menu />
            <div class="layout_content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0;
    padding: 0;
    .layout_container {
        display: flex;
        flex: 1;
        flex-direction: row;
        .layout_content {
            flex: 1;
            padding-left: 220px;
            padding-top: 60px;
            min-height: 100vh;
            overflow-y: hidden;
            background-color: var(--color-fill-2);
            box-sizing: border-box;
        }
    }
}
</style>