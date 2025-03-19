"use client";

import { useState } from "react";

export default function SearchInput({ setLoading, onSearch }: { setLoading: (loading: boolean) => void; onSearch: (query: string) => void }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.length > 0) {
            setLoading(true);
            // Add your search logic here
            onSearch(searchQuery);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                placeholder="Enter a movie title"
                className="flex-grow p-2 border border-gray-300 rounded-lg text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={handleSearch}>
                Search
            </button>
        </div>
    );
} 