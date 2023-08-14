<script lang="ts" setup>
import { TableColumnData } from '@arco-design/web-vue';
import { Ref, ref, reactive } from 'vue';
import dateFormate from '@/utils/index';
import { articles, tags } from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const tagOptions: Ref<optionType[]> = ref([])

const searchForm = reactive({
    author: '',
    tag: [],
})

const loading = ref(false)

const columns: TableColumnData[] | undefined[] = [
    {
        title: '文章ID',
        dataIndex: '_id',
        width: 240,
    },
    {
        title: '文章标题',
        dataIndex: 'title',
        width: 200,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '文章作者',
        dataIndex: 'atuthor',
        slotName: 'author',
        width: 200,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '文章描述',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '关注数量',
        dataIndex: 'favoritesCount',
    },
    {
        title: '标签',
        dataIndex: 'tagList',
        width: 200,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        slotName: 'createdAt',
        width: 200,
    },
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        slotName: 'updatedAt',
        width: 200,
    },
    {
        title: '操作',
        dataIndex: 'operator',
        slotName: 'operator',
        width: 180,
        fixed: 'right',
    },
]

const pagination = reactive({
    pageNum: 1,
    pageSize:  10,
    total: 0,
})

const articlesList = ref([])

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

const getArticlesList = async () => {
    const params = {
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        tag: searchForm.tag,
        author: searchForm.author
    }
    const { data, ok } = await articles.getArticlesList(params)
    if(!ok) {
        return
    }
    console.log(data)
    if(data.data) {
        const articles = data.data.articles;
        if(articles.length == 0 && pagination.pageNum > 1) {
            pagination.pageNum --;
            getArticlesList();
            return;
        }
        articlesList.value = articles;
        pagination.total = data.data.total;
    }
}

const handleSearch= () => {

}

const handleReset = () => {

}

const handleAdd = () => {
    router.push({
        name: 'articles.add'
    })
}

const handleChange = (val: number) => {
    pagination.pageNum = val;
    getArticlesList();
}

const handleEdit = (record: object) => {
    console.log(record)
}

const handleDelete = (articleId: string) => {
    console.log(articleId)
}

getAllTagsList();
getArticlesList();
</script>

<template>
    <div class="articles_container">
        <div class="articles_wrapper">
            <a-card class="general-card" title="文章管理">
                <div class="articles_search">
                    <div class="search_item">
                        <div class="item_label">作者</div>
                        <div class="item_content">
                            <a-input v-model="searchForm.author" placeholder="请输入用户姓名" />
                        </div>
                    </div>
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
                <div class="add_articles_btn">
                    <a-button type="primary" @click="handleAdd"> 新增文章 </a-button>
                </div>
                <div class="articles_table">
                    <a-table
                        :loading="loading"
                        :pagination="false"
                        :data="articlesList"
                        :columns="columns"
                        :bordered="false"
                        :scroll="{ x: 1800 }"
                    >
                        <template #author="{ record }">
                            <div class="create_time">
                                {{ (record as any).author?.username }}
                            </div>
                        </template>
                        <template #createdAt="{ record }">
                            <div class="create_time">
                                {{ filterTime((record as any).createdAt) }}
                            </div>
                        </template>
                        <template #updatedAt="{ record }">
                            <div class="create_time">
                                {{ filterTime((record as any).updatedAt) }}
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
                            v-if="articlesList.length"
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
            <router-view />
        </div>
    </div>
</template>

<style lang="less" scoped>
.articles_container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    .articles_wrapper {
        width: 100%;
        .articles_search {
            display: flex;
            align-items: center;
            .search_item {
                display: flex;
				align-items: flex-start;
                width: 380px;
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
        .add_articles_btn {
            margin-bottom: 20px;
        }
        .articles_table {
            width: 100%;
            overflow: hidden;
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