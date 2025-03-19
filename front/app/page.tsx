"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import SuggestedResults from "../components/SuggestedResults";
import ChatList from "../components/ChatList";
import { Chat, Suggestion } from "../types/types";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion>({ id: "", title: "", image: "", description: "" });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSuggestionSelect = (selectedSuggestion: Suggestion) => {
    setSelectedSuggestion(selectedSuggestion);
    setSuggestions([]);
    setChats([
      {
        id: (chats.length + 1).toString(),
        message: selectedSuggestion.title,
        isAI: true,
        type: "suggestion",
      }, ...chats]);
    setTimeout(() => {
      setChats([

        {
          id: (chats.length + 1).toString(),
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
          isAI: true,
          type: "query",
        }, ...chats
      ])

    }, 1000);
  };

  const handleSearch = (query: string) => {
    const obj = { id: (chats.length + 1).toString(), message: query, isAI: false, type: "query" as "query" }
    setChats([obj, ...chats]);
    setLoading(true);
    setTimeout(() => {
      // TODO: Add search logic
      console.log(`Searching for ${query}`);
      // populate suggestion base on query
      setSuggestions([
        { id: "1", title: "Movie 1", image: "https://via.placeholder.com/150", description: "Description for Movie 1" },
        { id: "2", title: "Movie 2", image: "https://via.placeholder.com/150", description: "Description for Movie 2" },
        { id: "3", title: "Movie 3", image: "https://via.placeholder.com/150", description: "Description for Movie 3" },
        { id: "4", title: "Movie 4", image: "https://via.placeholder.com/150", description: "Description for Movie 4" },
        { id: "5", title: "Movie 5", image: "https://via.placeholder.com/150", description: "Description for Movie 5" },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg h-screen flex flex-col">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 shadow-md rounded-t-lg">
        <h1 className="text-3xl font-extrabold text-white text-center">Xi-Tube Search</h1>
      </div>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-6 flex flex-col-reverse">
        {suggestions.length > 0 && (
          <SuggestedResults onSelect={handleSuggestionSelect} suggestions={suggestions} />
        )}
        {loading && <LoadingSpinner />}
        {chats.map((item) => <ChatList
          key={item.id}
          chat={item}
          handleSuggestionSelect={handleSuggestionSelect}
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
        />)}

      </div>
      <div className="p-6">
        <SearchInput setLoading={setLoading} onSearch={handleSearch} />
      </div>
    </div>
  );
}
