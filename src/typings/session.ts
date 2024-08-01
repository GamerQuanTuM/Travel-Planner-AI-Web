export interface Session {
    email: string,
    id: string,
    name: string,
    updatedAt: Date,
    createdAt: Date,
    subscription:"FREE" | "BASIC" | "STANDARD" | "PREMIUM"
}