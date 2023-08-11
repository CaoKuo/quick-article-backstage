import { httpCreate } from './http';
import { type CommonResponse, type Users } from './type';

const http = httpCreate('/api/user');

export const user = {
    /**
     * 获取登录的用户信息
     * @returns
     */
    async getCurrentUser<T>() {
        return await http.get<T, CommonResponse>('');
    },
    /**
     * 获取所有用户列表
     * @param params
     * @returns
     */
    async getUsersList<T>(params: object) {
        return await http.get<T, CommonResponse>('/list', { params });
    },
    /**
     * 更新用户信息
     * @param data
     * @returns
     */
    async updateUser<T>(data: Users) {
        return await http.put<T, CommonResponse>('', data);
    },
    /**
     * 删除用户信息
     * @param userId 用户ID
     * @returns
     */
    async deleteUser<T>(userId: string) {
        return await http.delete<T, CommonResponse>(`/${userId}`);
    },
};
