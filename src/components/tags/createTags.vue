<script lang="ts" setup>
import { errors } from '@/api';
import { tags } from '@/api';
import { Message, ValidatedError } from '@arco-design/web-vue';
import { computed } from 'vue';
import { ref, reactive } from 'vue';

const emit = defineEmits(['update'])

const type = ref('add')

const visible = ref(false);

const saveLoading = ref(false)

const tagsForm = ref()

const tagId = ref('')

const tagsInfo = reactive({
	tag: ''
})

const rules = {
	tag: [ { required: true, message: '请输入标签名' } ]
}

const tagsTitle = computed(() => {
	return type.value == 'add' ? '新增标签' : '编辑标签'
})

const init = (t: string, v = null) => {
	type.value = t
	if(v) {
		const curr: { [key: string]: any } = v;
		tagId.value  = curr._id
		tagsInfo.tag = curr.name;
	}
	visible.value = true
}

const handleOk = () => {
	tagsForm.value.validate(async (valid: undefined | Record<string, ValidatedError>) => {
		if(!valid) {
			saveLoading.value = true;
            const formData = {
				tag: tagsInfo.tag
			}

			if(type.value == 'add') {
				await handleSave(formData)
			} else {
				await handleEdit(formData)
			}
			saveLoading.value = false;
		}
	})
}

const handleSave = async (formData: object) => {
	try {
		const { data, ok } = await tags.addTags(formData)
		if(!ok) {
			saveLoading.value = false;
			return
		}
		console.log('data===' ,data)
		Message.success(data.msg);
		handleCancel();
		emit('update')
	} catch (error) {
		errors(error)
	}
}

const handleEdit = async(formData: object) => {
	try {
		const { data, ok } = await tags.updateTags(tagId.value, formData)
		if(!ok) {
			return
		}

		Message.success(data.msg);
		handleCancel();
		emit('update')
	} catch (error) {
		errors(error)
	}
}

const handleCancel = () => {
	tagsInfo.tag = ''
	visible.value = false
}

defineExpose({
	init
})
</script>

<template>
    <a-drawer
		class="add_users"
		:visible="visible"
		:title="tagsTitle"
		unmount-on-close
		width="560px"
		:ok-loading="saveLoading"
		ok-text="保存"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<a-form ref="tagsForm" :model="tagsInfo" :rules="rules" layout="vertical">
			<a-form-item field="tag" label="标签名" validate-trigger="blur">
				<a-input v-model="tagsInfo.tag" placeholder="请输入标签名"></a-input>
			</a-form-item>
		</a-form>
    </a-drawer>
</template>

<style lang="less" scoped></style>