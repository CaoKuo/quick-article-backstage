<script setup lang="ts">
</script>

<template>
	<router-view />
</template>

<style lang="less">
html,
body,
#app {
	height: 100%;
}

#app {
	min-width: 1200px;
}

*::-webkit-scrollbar {
	/* 血槽宽度 */
	width: 8px;
	height: 8px;
}

*::-webkit-scrollbar-thumb {
	/* 拖动条 */
	background-color: rgba(0, 0, 0, 0.3);
	border-radius: 6px;
}

*::-webkit-scrollbar-track {
	/* 背景槽 */
	background-color: transparent;
	border-radius: 6px;
}
</style>
