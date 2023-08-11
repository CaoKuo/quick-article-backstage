<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['submit'])

const visible = ref(false);

const currentSign = ref();

const init = (sign: string | number) => {
    currentSign.value = sign;
    visible.value = true;
}

const handleOk = () => {
    emit('submit', currentSign.value);
}

const handleCancel = () => {
    visible.value  = false;
}

defineExpose({
    init
})
</script>

<template>
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
        <template #title>
            提示
        </template>
        <div>确认删除？</div>
    </a-modal>
</template>

<style lang="less" scoped>

</style>