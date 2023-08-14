<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { user } from '@/api';
import { Message, TableColumnData } from '@arco-design/web-vue';
import dateFormate from '@/utils/index';
import createUser from '@/components/users/createUser.vue'
import deleteModal from '@/components/modal/deleteModal.vue'
import avator from '@/assets/images/avator.png'

const searchForm = reactive({
    username: '',
    email: '',
    role: '',
})

const pagination = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 10,
})

const loading = ref(false)

const usersList = ref([]);

const columns: TableColumnData[] | undefined = [
    {
        title: '用户姓名',
        dataIndex: 'name',
        slotName: 'name',
        width: 150,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '邮箱',
        dataIndex: 'email',
    },
    {
        title: '简介',
        dataIndex: 'bio',
        width: 200,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '角色',
        dataIndex: 'role',
        slotName: 'role',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        slotName: 'time',
        width: 180,
    },
    {
        title: '操作',
        dataIndex: 'operator',
        slotName: 'operator',
        fixed: 'right',
        width: 180,
    }
]

const roleOptions = [
    {
        value: '',
        label: '全部'
    },
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

const createUserRefs = ref();
const deleteModalRefs = ref();

const filterTime = (val: string) => {
    if(!val) {
        return '--'
    }
    
    const siteTime = new Date(val).getTime();

    return siteTime ? dateFormate(siteTime, 'YYYY-MM-DD hh:mm') : '--'
}

const filterRole = (val: number) => {
    let role = roleOptions.find(item => {
        return item.value === val;
    })
    return role ? role.label  : '--'
}

const getUserList = async () => {
    loading.value = true;
    const params = {
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        username: searchForm.username,
        email: searchForm.email,
        role: searchForm.role,
    }

    const { data, ok } = await user.getUsersList(params);

    if(!ok) {
        loading.value = false;
        return;
    }

    loading.value = false;
    if(data.data) {
        const users = data.data.users;
        if(users.length == 0 && pagination.pageNum > 1) {
            pagination.pageNum --;
            getUserList();
            return;
        }
        usersList.value = users;
        pagination.total = data.data.total;
    }
}

const handleSearch = () => {
    pagination.pageNum = 1;
    getUserList();
}

const handleReset = () => {
    searchForm.username = '';
    searchForm.email = '';
    searchForm.role = '';
    pagination.pageNum = 1;
    getUserList();
}

const handleAdd = async () => {
    await nextTick();
    createUserRefs.value.init('add')
}

const handleEdit = async (userInfo: object) => {
    await nextTick();
    createUserRefs.value.init('edit', userInfo);
}

const handleDelete = async (userId: string) => {
    await nextTick();
    deleteModalRefs.value.init(userId);
}

const handleDeleteSubmit = async (userId: string) => {
    const { data, ok } = await user.deleteUser(userId)
    if(!ok) {
        return;
    }
    Message.success(data.msg);
    getUserList();
}

const handleChange = (val: number) => {
    console.log(val)
    pagination.pageNum = val;
    getUserList();
}

const updateList = () => {
    handleReset();
}

getUserList();
</script>

<template>
    <div class="users_container">
        <div class="users_wrapper">
            <a-card class="general-card" title="用户管理">
                <div class="users_search">
                    <div class="search_item">
                        <div class="item_label">用户姓名</div>
                        <div class="item_content">
                            <a-input v-model="searchForm.username" placeholder="请输入用户姓名" />
                        </div>
                    </div>
                    <div class="search_item">
                        <div class="item_label">用户邮箱</div>
                        <div class="item_content">
                            <a-input v-model="searchForm.email" placeholder="请输入用户邮箱" />
                        </div>
                    </div>
                    <div class="search_item">
                        <div class="item_label">用户权限</div>
                        <div class="item_content">
                            <a-select v-model="searchForm.role" placeholder="全部" allow-clear>
                                <a-option
                                    v-for="(item, index) in roleOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </a-select>
                        </div>
                    </div>
                    <div class="search_item">
                        <a-button type="primary" @click="handleSearch"> 查询 </a-button>
                        <a-button @click="handleReset"> 重置 </a-button>
                    </div>
                </div>
                <a-divider />
                <div class="add_user_btn">
                    <a-button type="primary" @click="handleAdd"> 新增用户 </a-button>
                </div>
                <div class="users_table">
                    <a-table
                        :loading="loading"
                        :pagination="false"
                        :data="usersList"
                        :columns="columns"
                        :bordered="false"
                    >
                        <template #name="{ record }">
                            <div class="user_square">
                                <div class="user_avator">
                                    <img :src="(record as any).image ? (record as any).image : avator" alt="">
                                </div>
                                <div class="user_name">
                                    {{ (record as any).username }}
                                </div>
                            </div>
                        </template>
                        <template #role="{ record }">
                            {{ filterRole((record as any).role) }}
                        </template>
                        <template #time="{ record }">
                            <div class="create_time">
                                {{ filterTime((record as any).createdAt) }}
                            </div>
                        </template>
                        <template #operator="{ record }">
                            <div class="operator_square">
                                <a-button
                                    type="text"
                                    size="small"
                                    @click="handleEdit(record)"
                                >
                                    编辑
                                </a-button>
                                <a-button
                                    type="text"
                                    status="danger"
                                    size="small"
                                    @click="handleDelete((record as any)._id)"
                                >
                                    删除
                                </a-button>
                            </div>
                        </template>
                    </a-table>
                    <div class="table_bottom">
                        <a-pagination
                            v-if="usersList.length"
                            size="small"
                            :total="pagination.total"
                            :current="pagination.pageNum"
                            :page-size="pagination.pageSize"
                            show-total
                            @change="handleChange"
                        />
                    </div>
                </div>
            </a-card>
        </div>
    </div>

    <!-- add or edit users -->
    <create-user ref="createUserRefs" @update="updateList" />

    <!-- delete users tips -->
    <delete-modal ref="deleteModalRefs" @submit="handleDeleteSubmit" />
</template>

<style lang="less" scoped>
.users_container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    .users_wrapper {
        width: 100%;
        .users_search {
            display: flex;
            align-items: center;
            .search_item {
                display: flex;
				align-items: flex-start;
                width: 220px;
                flex-shrink: 0;
                .item_label {
					width: 56px;
					height: 32px;
					line-height: 32px;
					text-align: center;
					font-size: 14px;
					color: #808080;
					flex-shrink: 0;
					margin-right: 8px;
				}
				.item_content {
					flex-grow: 1;
				}
                .arco-btn + .arco-btn {
                    margin-left: 10px;
                }
                & + .search_item {
                    margin-left: 20px;
                }
            }
        }
        .add_user_btn {
            margin-bottom: 20px;
        }
        .users_table {
            width: 100%;
            .table_bottom {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                margin-top: 12px;
            }
            .user_square {
                display: flex;
                align-items: center;
                .user_avator {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .user_name {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>