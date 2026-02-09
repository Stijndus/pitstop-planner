import { UserBasic } from "./user.model";

export interface Profile {
    id: number;
    username: string;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at?: string;
}