import Image from "next/image";
import { Suggestion } from "../types/types";

export default function SelectedSuggestion({ selectedSuggestion }: { selectedSuggestion: Suggestion }) {
    return (
        <div className="border p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
                <div className="bg-gray-400 h-16 w-16 mr-4 rounded">
                    <Image src={selectedSuggestion.image} alt={selectedSuggestion.title} className="w-full h-full object-cover rounded" width={64} height={64} />
                </div>
                <div>
                    <p className="font-bold text-black">{selectedSuggestion.title}</p>
                </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-black">
                    {selectedSuggestion.description}
                </p>
            </div>
        </div>
    );
} 