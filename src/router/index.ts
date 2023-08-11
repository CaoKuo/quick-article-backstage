import { type Router, createRouter, createWebHashHistory } from 'vue-router';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/layout',
        },
        {
            path: '/login',
            name: 'login',
            component: async () => await import(/* webpackChunkName: "login" */ '@/views/login.vue'),
        },
        {
            path: '/layout',
            name: 'layout',
            component: async () => await import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
            redirect: {
                name: 'home',
            },
            children: [
                {
                    path: '/home',
                    name: 'home',
                    meta: {
                        icon: 'icon-home',
                        title: '工作台',
                    },
                    component: async () => await import(/* webpackChunkName: "home" */ '@/views/home.vue'),
                },
                {
                    path: '/users',
                    name: 'users',
                    meta: {
                        icon: 'icon-user-group',
                        title: '用户管理',
                    },
                    component: async () => await import(/* webpackChunkName: "users" */ '@/views/users.vue'),
                },
                {
                    path: '/articles',
                    name: 'articles',
                    meta: {
                        icon: 'icon-bookmark',
                        title: '文章管理',
                    },
                    component: async () => await import(/* webpackChunkName: "articles" */ '@/views/articles.vue'),
                },
            ],
        },
    ],
});

export default router;
