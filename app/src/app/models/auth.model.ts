import { Profile } from "./profile.model";

export interface LoginCredentials {
    email: string;
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
    data: {
        access_token: string;
        expires_in: string;
        token_type: string;
        user: Profile;
    };
}
