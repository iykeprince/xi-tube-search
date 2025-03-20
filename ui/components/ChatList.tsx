import AIBubble from "./AIBubble";
import ChatBubble from "./ChatBubble";
import { Chat } from '../types/types';
import SelectedSuggestion from "./SelectedSuggestion";

export default function ChatList({
    chat,
}: {
    chat: Chat;
}) {
    return (
        <div className="mb-4">
            {chat.type === "query" && !chat.isAI && <ChatBubble chat={chat} />}
            {chat.type === "suggestion" && chat.isAI && <SelectedSuggestion chat={chat} />}
            {chat.type === "query" && chat.isAI && (
                <>

                    <AIBubble chat={chat} />
                </>
            )}
        </div>
    );
}