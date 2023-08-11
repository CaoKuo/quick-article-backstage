import axios, { type AxiosInstance } from 'axios';
import { Message } from '@arco-design/web-vue';
import { type CommonResponse } from './type';
import env from './config.ts';
import router from '@/router/index.ts';

const config = {
    ...env,
    errors (err: any) {
        let msg = (err.msg as boolean) ? err.msg : (err.message as boolean) ? err.message : err.toString();
        const current = err.response.data;
        if (current.code === -1 && (current.errors as boolean) && Array.isArray(current.errors)) {
            msg = current.errors[0].msg;
        }
        Message.error(msg);
    },
    login (res: CommonResponse) {
        console.error(res);
        router.replace({
            name: 'login',
        });
    },
    filter (res: CommonResponse) {
        const { status, data } = res;
        if (status >= 200 && status < 300) {
            if (data.code === 0) {
                res.ok = true;
                return res;
            } else if (data.code === 401) {
                Message.error(data.msg);
                setTimeout(() => {
                    this.login(res);
                }, 1000);
                return res;
            }
        }
        this.errors(data.msg);
        res.ok = false;
        return res;
    },
};

const httpCreate = (baseURL: string, timeout = 120e3): AxiosInstance => {
    const instance = axios.create({
        baseURL: config.apiPath + baseURL,
        timeout,
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    instance.interceptors.response.use(config.filter.bind(config));
    return instance;
};

const { errors } = config;

export {
    httpCreate,
    errors,
};
