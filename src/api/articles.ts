import { httpCreate } from './http';
import { type CommonResponse } from './type';

const http = httpCreate('/api/articles');

export const articles = {
    /**
     * 获取文章列表
     * @param params
     * @returns
     */
    async getArticlesList<T>(params: object) {
        return await http.get<T, CommonResponse>('', params);
    },
};
