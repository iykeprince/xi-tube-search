import AIBubble from "./AIBubble";
import ChatBubble from "./ChatBubble";
import { Chat } from '../types/types';

export default function ChatList({
    chat,
}: {
    chat: Chat;
}) {
    return (
        <div className="mb-4">
            {chat.type === "query" && !chat.isAI && <ChatBubble chat={chat} />}
            {/* <SelectedSuggestion selectedSuggestion={selectedSuggestion} /> */}
            {chat.isAI && chat.type === "query" && (
                <>

                    <AIBubble chat={chat} />
                </>
            )}
        </div>
    );
}