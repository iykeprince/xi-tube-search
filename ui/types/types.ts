export type Suggestion = {
    id: string;
    title: string;
    image: string;
    description: string;
};

export type Chat = {
    id: string;
    message: string;
    isAI: boolean;
    type: "query" | "suggestion";
    image?: string;
    title?: string;
}; 