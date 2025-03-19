import { Chat } from "../types/types";

export default function ChatBubble({ chat }: { chat: Chat }) {
    return (
        <div className="bg-gray-700 p-3 rounded-lg inline-block mb-4">
            {chat.message}
        </div>
    );
} 