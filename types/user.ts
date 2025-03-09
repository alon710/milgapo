// Define user types for the application
export interface UserDetails {
    id: string;
    email?: string;
    user_metadata?: {
        [key: string]: any;
    };
    app_metadata?: {
        [key: string]: any;
    };
    role?: string;
}
