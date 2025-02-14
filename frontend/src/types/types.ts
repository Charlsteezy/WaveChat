export type User = {
    id: string;
    name: string;
    imageUrl: string;
};

export type Message = {
    message: string | null;
    userId: string;
    userName: string;
    profileImageUrl: string;
    type: string;
    sent: Date;
}

export type NameCreateInputs = {
    name: string;
    nameRequired: string;
}