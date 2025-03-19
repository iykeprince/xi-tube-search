import { Suggestion } from '../types/types';

type SuggestedResultsProps = {
    onSelect: (selectedSuggestion: Suggestion) => void;
    suggestions: Suggestion[];
};

export default function SuggestedResults({ onSelect, suggestions }: SuggestedResultsProps) {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 text-black">Top search results</h2>
            <div className="grid grid-cols-3 gap-4">
                {[...suggestions].map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-200 p-4 rounded-lg cursor-pointer"
                        onClick={() => onSelect(item)}
                    >
                        <div className="bg-gray-400 h-32 mb-2"></div>
                        <p className="text-sm text-black">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 