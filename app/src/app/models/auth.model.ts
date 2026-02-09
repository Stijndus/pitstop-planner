import { Profile } from "./profile.model";

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    success: boolean;
    authorization: {
        token: string;
        type: string;
    };
    user: Profile;
}
