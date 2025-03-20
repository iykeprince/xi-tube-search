import { Chat } from "../types/types";

export default function SelectedSuggestion({ chat }: { chat: Chat }) {
    return (
        <div className="border p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
                <div className="bg-gray-400 h-16 w-16 mr-4 rounded">
                    <img src={chat?.image ?? ""} alt={chat?.title ?? ""} className="object-cover rounded h-16 w-16" />
                </div>
                <div>
                    <p className="font-bold text-black">{chat.title}</p>
                </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-black">
                    {chat.message}
                </p>
            </div>
        </div>
    );
} 