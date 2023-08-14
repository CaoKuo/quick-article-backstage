<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const routes = router.options.routes;

const menus = computed(() => {
    if(routes[2] && routes[2].children) {
        return routes[2].children.filter((e) => {
            return !(e.meta && e.meta.hidden);
        });
    }
    return [];
})

const showMenu = ref(false);

const selectedKeys = computed(() => {
    let name = ''
    if(route.name) {
        name = (route.name as string).split('.')[0]
    }
   
    return [name]
})

const handleClick = (key: any) => {
    router.push({
        name: key
    })
}

</script>

<template>
    <div class="layout_menu">
        <div class="layout_slider">
            <div class="menu_wrapper">
                <a-menu
			        v-model:collapsed="showMenu"
                    :selected-keys="selectedKeys"
			        :style="{ width: '220px', height: '100%' }"
                    @menu-item-click="handleClick"
                >
                    <a-menu-item v-for="item in menus" :key="(item.name as string)">
                        <template #icon>
                            <component :is="item.meta?.icon" />
                        </template>
                        {{ item.meta?.title }}
                    </a-menu-item>
                </a-menu>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.layout_menu {
    padding-top: 60px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    .layout_slider {
        height: 100%;
        overflow: auto;
        overflow-y: hidden;
        .menu_wrapper {
            height: 100%;
            overflow: auto;
            overflow-x: hidden;
        }
    }
}
</style>