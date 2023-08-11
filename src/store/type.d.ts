interface UserState {
    email: string
    username?: string
    image?: string | null
    bio?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    role: number
    [key: string]: any
}
