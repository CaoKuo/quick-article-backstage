<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message, ValidatedError } from '@arco-design/web-vue';
import { users, errors } from '@/api';

const router = useRouter();

const loading = ref(false)

const loginForm = ref()

const userInfo = reactive({
    email: 'caokuo@admin.com',
    password: '1234qwer',
})

const rules = {
    email: [
        { required: true, message: '请输入邮箱' },
        {
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '请输入正确的邮箱'
        }
    ],
	password: [
        { required: true, message: '请输入密码' },
		{
			match: /^(?![0-9]+$)(?![a-zA-Z]+$)(?!\W+$)[0-9A-Za-z\W]{6,16}$/,
			message: '6-16位字符，字母、数字、英文符号至少包含两种',
		},
	],
}

const handleSubmit = async () => {
    loginForm.value.validate(async (valid: undefined | Record<string, ValidatedError>) => {
        if(!valid) {
            try {
                const dataForm = {
                    user: {
                        email: userInfo.email,
                        password: userInfo.password
                    }
                }
                const { data, ok } = await users.usersLogin(dataForm)
                if(!ok) {
                    return
                }
                console.log(data)
                Message.success('登录成功')
                router.replace({
                    name: 'home'
                })
            } catch (error) {
                loading.value = false;
                errors(error)
            }
        }
    })
}

// const handleRegister = async () => {
//     loginForm.value.validate(async (valid: undefined | Record<string, ValidatedError>) => {
//         if(!valid) {
//             try {
//                 loading.value = true;

//                 const formData = {
//                     user: {
//                         email: userInfo.email,
//                         password: userInfo.password
//                     }
//                 }

//                 const { data, ok } = await users.usersRegister(formData)
//                 console.log('ok====', ok)
//                 if(!ok) {
//                     loading.value = false;
//                     return;
//                 }

//                 console.log('data.data----', data)
//             } catch (error) {
//                 console.log('error===', error)
//                 loading.value = false;
//                 errors(error)
//             }
//         }
//     })
// }

</script>

<template>
    <div class="login-form-wrapper">
        <div class="login-form-title">Quick Article 登录</div>
        <a-form ref="loginForm" :model="userInfo" :rules="rules" class="login-form" layout="vertical" @submit="handleSubmit">
            <a-form-item field="email" hide-label validate-trigger="blur">
                <a-input v-model="userInfo.email" placeholder="请输入邮箱">
                    <template #prefix>
                        <icon-user />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label validate-trigger="blur">
                <a-input-password v-model="userInfo.password" placeholder="请输入密码" allow-clear>
                    <template #prefix>
                        <icon-lock />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-space :size="16" direction="vertical">
                <div class="login-form-password-actions">
                    <a-link>忘记密码</a-link>
                </div>
                <a-button type="primary" html-type="submit" long :loading="loading">
                    登录
                </a-button>
                <!-- <a-button type="text" long class="login-form-register-btn" @click="handleRegister">
                    注册
                </a-button> -->
            </a-space>
        </a-form>
    </div>
</template>
  
<style lang="less" scoped>
.login-form {
    &-wrapper {
        width: 320px;
    }

    &-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 32px;
    }

    &-password-actions {
        display: flex;
        justify-content: space-between;
    }

    &-register-btn {
        color: var(--color-text-3) !important;
    }
}
</style>