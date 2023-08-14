<script lang="ts" setup>
import { Ref, ref, reactive, nextTick } from 'vue';
import { Message, TableColumnData } from '@arco-design/web-vue';
import { tags } from '@/api';
import dateFormate from '@/utils/index';
import createTags from '@/components/tags/createTags.vue';
import deleteModal from '@/components/modal/deleteModal.vue';

const searchForm = reactive({
    tag: '',
})

const tagOptions: Ref<optionType[]> = ref([])

const loading = ref(false)

const tagsList = ref([])

const columns: TableColumnData[] | undefined[] = [
    {
        title: '标签名称',
        dataIndex: 'name'
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        slotName: 'createdAt'
    },
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        slotName: 'updatedAt'
    },
    {
        title: '操作',
        dataIndex: 'operator',
        slotName: 'operator',
        width: 180,
    }
]

const pagination = reactive({
    pageNum: 1,
    pageSize:  10,
    total: 0,
})

const createTagsRefs = ref()
const deleteModalRefs = ref()

const filterTime = (val: string) => {
    if(!val) {
        return '--'
    }
    
    const siteTime = new Date(val).getTime();

    return siteTime ? dateFormate(siteTime, 'YYYY-MM-DD hh:mm') : '--'
}

const getAllTagsList = async () => {
    const { data, ok } = await tags.getAllTagsList();

    if(!ok) {
        return;
    }

    tagOptions.value = data.data.tags.map((item: any) => {
        return {
            label: item.name,
            value: item._id
        }
    })
}

const getTagsList = async () => {
    loading.value = true;
    const params = {
        pageNum: pagination.pageNum,
        pageSize:  pagination.pageSize,
        tag: searchForm.tag
    }

    const { data, ok } = await tags.getTagsList(params)
    if(!ok) {
        loading.value = false;
        return
    }

    if(data.data) {
        const tags = data.data.tags;
        if(tags.length == 0 && pagination.pageNum > 1) {
            pagination.pageNum --;
            getTagsList();
            return;
        }
        tagsList.value = tags
        pagination.total = data.data.total
    }

    loading.value = false;
}

const handleSearch = async () => {
    pagination.pageNum = 1;
    getTagsList();
}

const handleReset = () => {
    searchForm.tag = '';
    pagination.pageNum = 1;
    getTagsList();
}

const handleAdd = async () => {
    await nextTick();
    createTagsRefs.value.init('add')
}

const handleChange = (val: number) => {
    pagination.pageNum = val;
    getTagsList();
}

const handleEdit = async (record: object) => {
    await nextTick();
    createTagsRefs.value.init('edit', record)
}

const handleDelete = async (tagId: string) => {
    await nextTick();
    deleteModalRefs.value.init(tagId)
}

const handleDeleteSubmit = async (tagId: string) => {
    const { data, ok } = await tags.deleteTags(tagId)
    if(!ok) {
        return
    }

    Message.success(data.msg)

    getAllTagsList();
    getTagsList();
}

getAllTagsList();
getTagsList();
</script>

<template>
    <div class="tags_container">
        <div class="tags_wrapper">
            <a-card class="general-card" title="标签管理">
                <div class="tags_search">
                    <div class="search_item">
                        <div class="item_label">文章标签</div>
                        <div class="item_content">
                            <a-select v-model:model-value="searchForm.tag" placeholder="全部" multiple :max-tag-count="2" allow-clear allow-search>
                                <a-option
                                    v-for="(item, index) in tagOptions"
                                    :key="index"
                                    :label="item.label"
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
                <div class="add_tags_btn">
                    <a-button type="primary" @click="handleAdd"> 新增标签 </a-button>
                </div>
                <div class="tags_table">
                    <a-table
                        :loading="loading"
                        :pagination="false"
                        :data="tagsList"
                        :columns="columns"
                        :bordered="false"
                    >
                        <template #createdAt="{ record }">
                            {{ filterTime((record as any).createdAt) }}
                        </template>
                        <template #updatedAt="{ record }">
                            {{ filterTime((record as any).updatedAt) }}
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
                            v-if="tagsList.length"
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

        <!-- add or edit tag -->
        <create-tags ref="createTagsRefs" @update="handleReset" />

        <!-- delete tag tips -->
        <delete-modal ref="deleteModalRefs" @submit="handleDeleteSubmit" />
    </div>
</template>

<style lang="less" scoped>
.tags_container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    .tags_wrapper {
        width: 100%;
        .tags_search {
            display: flex;
            align-items: center;
            .search_item {
                display: flex;
				align-items: flex-start;
                width: 400px;
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
        .add_tags_btn {
            margin-bottom: 20px;
        }
        .tags_table {
            width: 100%;
            .table_bottom {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                margin-top: 12px;
            }
        }
    }
}
</style>