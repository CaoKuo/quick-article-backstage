import { httpCreate } from './http';
import { type CommonResponse, type Users } from './type';

const http = httpCreate('/api/users');

export const users = {
    /**
     * 用户注册
     * @param data Users
     * @returns
     */
    async usersRegister<T>(data: Users) {
        return await http.post<T, CommonResponse>('', data);
    },
    /**
     * 用户登录
     * @param data Users
     * @returns
     */
    async usersLogin<T>(data: Users) {
        return await http.post<T, CommonResponse>('/login', data);
    },
};
