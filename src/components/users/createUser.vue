<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { errors, users, user } from '@/api';
import { ValidatedError, FileItem, Message } from '@arco-design/web-vue';
import { computed, reactive, ref } from 'vue';
import { Users } from '@/api/type';

const userStore = useUserStore();

const emit = defineEmits(['update'])

const type = ref('add');
const userId = ref('');
const loading = ref(false);
const visible = ref(false);

const usersForm = ref();

const userInfo = reactive({
    username: 'Driscoll',
    email: 'Driscoll@admin.com',
    password: '1234qwer',
    image: '',
    bio: 'Driscoll is user2',
    role: 0,
})

let file: FileItem

const roleOptions = [
    {
        value: 0,
        label: '用户'
    },
    {
        value: 1,
        label: '管理员'
    },
    {
        value: 2,
        label: '超级管理员'
    }
]

const rules = {
    email: [
        { required: true, message: '请输入邮箱' },
        {
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '请输入正确的邮箱'
        }
    ],
    username: [{ required: true, message: '请输入用户名' }],
	password: [
        { required: true, message: '请输入密码' },
		{
			match: /^(?![0-9]+$)(?![a-zA-Z]+$)(?!\W+$)[0-9A-Za-z\W]{6,16}$/,
			message: '6-16位字符，字母、数字、英文符号至少包含两种',
		},
	],
}

const drawerTitle  = computed(() => {
    return type.value ==  'add' ? '新增用户' : '编辑用户'
})

const saveLoading = ref(false);

const disabled = computed(() => {
    return userStore.role == 2 ? false : true;
})

const init = (t: string, info = null) => {
    type.value = t
    if(info) {
        const curr: { [key: string]: any } = info;
        userId.value = curr._id;
        userInfo.username = curr.username;
        userInfo.email = curr.email
        userInfo.password = curr.password
        userInfo.image = curr.image
        userInfo.bio = curr.bio
        userInfo.role = curr.role
    }
    visible.value = true;
}

const onChange = () => {

}

const handleOk = () => {
    usersForm.value.validate(async (valid: undefined | Record<string, ValidatedError>) => {
        if(!valid) {
            saveLoading.value = true;
            const formData = {
                user: {
                    ...userInfo
                }
            }
            if(type.value == 'add') {
                await handleSave(formData)
            } else {
                await handleEdit(formData);
            }
            saveLoading.value = false;
        }
    })
}

const handleSave = async (formData: Users) => {
    try {
        const { data, ok } = await users.usersRegister(formData)
        if(!ok) {
            saveLoading.value = false;
            return;
        }
        console.log('===', data)
        Message.success('保存成功');
        handleCancel();
        emit('update')
    } catch (error) {
        errors(error)
        return;
    }
}

const handleEdit = async (formData: Users) => {
    try {
        if(userId.value) {
            formData.user._id = userId.value;
        }
        const { data, ok }  = await user.updateUser(formData);
        if(!ok) {
            saveLoading.value = false;
            return;
        }
        console.log('===', data)
        Message.success('更新成功');

        handleCancel();
        emit('update')
    } catch (error) {
        errors(error)
    }
}

const handleCancel = () => {
    userInfo.username = ''
    userInfo.email = ''
    userInfo.password = ''
    userInfo.image = ''
    userInfo.bio = ''
    userInfo.role = 0
    visible.value = false;
    saveLoading.value = false;
}

defineExpose({
    init
})

</script>

<template>
    <a-drawer
		class="add_users"
		:visible="visible"
		:title="drawerTitle"
		unmount-on-close
		width="560px"
		:ok-loading="saveLoading"
		ok-text="保存"
		@ok="handleOk"
		@cancel="handleCancel"
	>
        <template v-if="type == 'edit' && loading">
			<div class="spin_loading">
				<a-spin dot />
			</div>
		</template>
        <template v-else>
            <a-form ref="usersForm" :model="userInfo" :rules="rules" class="login-form" layout="vertical">
                <a-form-item field="email" label="邮箱" validate-trigger="blur">
                    <a-input v-model="userInfo.email" placeholder="请输入邮箱"></a-input>
                </a-form-item>
                <a-form-item field="username" label="用户姓名" validate-trigger="blur">
                    <a-input v-model="userInfo.username" placeholder="请输入用户姓名"></a-input>
                </a-form-item>
                <a-form-item field="image" label="用户头像">
                    <a-upload
                        action="/"
                        :fileList="file ? [file] : []"
                        :show-file-list="false"
                        accept=".png,.jpg,.jpeg"
                        @change="onChange"
                    >
                        <template #upload-button>
                            <div
                                class="arco-upload-list-picture custom-upload-avatar"
                                v-if="file && file.url"
                            >
                                <img :src="file.url" />
                                <div class="arco-upload-list-picture-mask">
                                    <IconEdit />
                                </div>
                            </div>
                            <div class="arco-upload-picture-card" v-else>
                                <div class="arco-upload-picture-card-text">
                                    <IconPlus />
                                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                                </div>
                            </div>
                        </template>
                    </a-upload>
                </a-form-item>
                <a-form-item v-if="type == 'add'" field="password" label="密码" validate-trigger="blur">
                    <a-input v-model="userInfo.password" placeholder="请输入密码"></a-input>
                </a-form-item>
                <a-form-item field="bio" label="用户简介">
                    <a-textarea v-model="userInfo.bio" placeholder="请输入用户简介" :max-length="50" allow-clear show-word-limit />
                </a-form-item>
                <a-form-item field="bio" label="用户角色">
                    <a-select v-model="userInfo.role" :disabled="disabled" placeholder="请选择用户权限" allow-clear>
                        <a-option
                            v-for="(item, index) in roleOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </a-select>
                </a-form-item>
            </a-form>
        </template>
    </a-drawer>
</template>

<style lang="less" scoped></style>