export interface UserBasic {
    id: number;
    username: string;
    name: string;
    avatar_url?: string;
}

export interface UpdateProfileData {
    username?: string;
    name?: string;
    email?: string;
    bio?: string;
    avatar_url?: string;
    password?: string;
    password_confirmation?: string;
}
