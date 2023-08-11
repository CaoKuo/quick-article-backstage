// /// <reference types="vite/client" />
import 'vite/client';
declare module '*.vue' {
    import { type ComponentOptions } from 'vue';
    const componentOptions: ComponentOptions;
    export default componentOptions;
}
