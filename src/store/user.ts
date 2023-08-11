import { defineStore } from 'pinia';
import { user, errors } from '@/api';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        email: '',
        username: '',
        image: '',
        bio: '',
        createdAt: '',
        updatedAt: '',
        role: 0,
    }),
    actions: {
        setInfo (partial: Partial<UserState>) {
            this.$patch(partial);
        },
        resetInfo () {
            this.$reset();
        },
        async getUserInfo () {
            try {
                const { data, ok } = await user.getCurrentUser();
                if (!ok) {
                    return;
                }
                this.setInfo(data.data.user);
            } catch (error) {
                errors(error);
            }
        },
    },
});
