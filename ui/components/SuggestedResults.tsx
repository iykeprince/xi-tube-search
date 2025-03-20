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
                        <img src={item.image} width="120px" height="120px" className="bg-gray-400 mb-2" alt={item.title} />


                        <p className="text-sm text-black">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 