import AIBubble from "./AIBubble";
import ChatBubble from "./ChatBubble";
import SelectedSuggestion from "./SelectedSuggestion";
import { Chat, Suggestion } from '../types/types';

export default function ChatList({
    chat,
    handleSuggestionSelect,
    suggestions = [],
    selectedSuggestion = { id: "", title: "", image: "", description: "" },
}: {
    chat: Chat;
    handleSuggestionSelect: (selectedSuggestion: Suggestion) => void;
    suggestions: Suggestion[];
    selectedSuggestion: Suggestion;
}) {
    return (
        <div className="mb-4">
            {chat.type === "query" && !chat.isAI && <ChatBubble chat={chat} />}

            {chat.isAI && chat.type === "query" && (
                <>
                    <SelectedSuggestion selectedSuggestion={selectedSuggestion} />
                    <AIBubble chat={chat} />
                </>
            )}
        </div>
    );
}