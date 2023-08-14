import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import router from './router/index.ts';
import '@arco-design/web-vue/dist/arco.css';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

const pinia = createPinia();
const app = createApp(App);

VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
});

app.use(router);
app.use(pinia);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(VueMarkdownEditor);
app.mount('#app');
