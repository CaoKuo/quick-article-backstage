import { httpCreate } from './http';
import { type CommonResponse } from './type';

const http = httpCreate('/api/tags');

export const tags = {
    /**
     * 获取标签列表
     * @param params
     * @returns
     */
    async getTagsList<T>(params: object) {
        return await http.get<T, CommonResponse>('', { params });
    },
    async getAllTagsList<T>() {
        return await http.get<T, CommonResponse>('/all');
    },
    /**
     * 新增标签
     * @param data
     * @returns
     */
    async addTags<T>(data: object) {
        return await http.post<T, CommonResponse>('', data);
    },
    /**
     * 编辑标签
     * @param tagId 标签ID
     * @param data
     * @returns
     */
    async updateTags<T>(tagId: string, data: object) {
        return await http.put<T, CommonResponse>(`/${tagId}`, data);
    },
    /**
     * 删除标签
     * @param tagId 标签ID
     * @param data
     * @returns
     */
    async deleteTags<T>(tagId: string) {
        return await http.delete<T, CommonResponse>(`/${tagId}`);
    },
};
