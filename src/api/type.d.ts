import { type AxiosResponse } from 'axios';

interface CommonResponse extends AxiosResponse {
    ok?: boolean
}

interface Users {
    user: {
        email: string
        password: string
        [key: string]: any
    }
}
