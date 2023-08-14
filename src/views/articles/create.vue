<script lang="ts" setup>
import { Ref, ref, reactive } from 'vue';

const articleForm = reactive({
    author: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    favoritesCount: 0
})
const userOptions: Ref<optionType[]> = ref([])
const tagOptions: Ref<optionType[]> = ref([])
</script>

<template>
    <div class="articles_container">
        <div class="articles_wrapper">
            <a-card class="general-card" title="新增文章">
                <div class="create_item">
                    <div class="item_title">文章作者</div>
                    <div class="item_content">
                        <a-select v-model:model-value="articleForm.author" placeholder="请选择文章作者" allow-clear allow-search>
                            <a-option
                                v-for="(item, index) in userOptions"
                                :key="index"
                                :label="item.label"
                            />
                        </a-select>
                    </div>
                </div>
                <div class="create_item">
                    <div class="item_title">文章标题</div>
                    <div class="item_content">
                        <a-input v-model:model-value="articleForm.title" placeholder="请输入文章标题" :max-length="{length:50, errorOnly:true}" allow-clear show-word-limit />
                    </div>
                </div>
                <div class="create_item">
                    <div class="item_title">文章简介</div>
                    <div class="item_content">
                        <a-textarea
                            v-model:model-value="articleForm.description"
                            placeholder="请输入文章简介"
                            :max-length="{length:200, errorOnly:true}"
                            :auto-size="{
                                minRows:3,
                                maxRows:5
                            }"
                            allow-clear
                            show-word-limit
                        />
                    </div>
                </div>
                <div class="create_item">
                    <div class="item_title">文章内容</div>
                    <div class="item_content">
                        <v-md-editor v-model="articleForm.body" height="400px"></v-md-editor>
                    </div>
                </div>
                <div class="create_item">
                    <div class="item_title">文章标签</div>
                    <div class="item_content">
                        <a-select v-model:model-value="articleForm.tagList" placeholder="请选择文章标签" multiple :max-tag-count="2" allow-clear allow-search>
                            <a-option
                                v-for="(item, index) in tagOptions"
                                :key="index"
                                :label="item.label"
                            />
                        </a-select>
                    </div>
                </div>
                <div class="create_item">
                    <div class="item_title">点赞数</div>
                    <div class="item_content">
                        <a-input-number v-model="articleForm.favoritesCount" placeholder="Please Enter" :min="0" />
                    </div>
                </div>
            </a-card>
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
        .create_item {
            width: 100%;
            .item_title {
                font-size: 14px;
                color: #000;
            }
            .item_content {
                margin-top: 14px;
            }
            & + .create_item {
                margin-top: 30px;
            }
        }
    }
}
</style>