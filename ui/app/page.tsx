"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import SuggestedResults from "../components/SuggestedResults";
import ChatList from "../components/ChatList";
import { Chat, Suggestion } from "../types/types";
import { getSuggestions } from "@/services/suggestion";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSuggestionSelect = async (selectedSuggestion: Suggestion) => {
    // Clear suggestions immediately
    setSuggestions([]);
  
    // Add the selected suggestion to the beginning of the chat
    const newSuggestionChat: Chat = {
      id: (chats.length + 1).toString(),
      message: selectedSuggestion.title,
      isAI: true,
      type: "suggestion",
    };
  
    setChats(prevChats => [newSuggestionChat, ...prevChats]);
  
    // Simulate AI response after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const aiResponseChat: Chat = {
      id: (chats.length + 2).toString(),
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      isAI: true,
      type: "query",
    };
  
    setChats(prevChats => [aiResponseChat, ...prevChats]);
  };
  console.log('chats', chats)

  const handleSearch = async (query: string) => {
    const obj = {
      id: (chats.length + 1).toString(),
      message: query,
      isAI: false,
      type: "query" as const
    };
    setChats([...chats, obj]);

    setLoading(true);
    // TODO: Add search logic
    console.log(`Searching for ${query}`);
    try {
      // const suggestions = await getSuggestions(query)
      const suggestions: any[] = []
      console.log('suggestions returned', suggestions)

      const formattedSuggestions = (suggestions as any[]).map((suggestion, idx) => ({
        id: (++idx).toString(),
        title: suggestion.title,
        description: suggestion?.description ?? "",
        image: suggestion?.thumbnail?.static ?? "",
      }))
      // populate suggestion base on query
      setSuggestions([
        ...formattedSuggestions,
        { id: '200', title: "We are here", description: 'some detail summary of something', image: "https://picsum.photos/400" },
        { id: '220', title: "We are here", description: 'some detail summary of something', image: "https://picsum.photos/400" },
        { id: '230', title: "We are here", description: 'some detail summary of something', image: "https://picsum.photos/400" }
      ]);
    } catch (error) {

    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg h-screen flex flex-col">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 shadow-md rounded-t-lg">
        <h1 className="text-3xl font-extrabold text-white text-center">Xi-Tube Search</h1>
      </div>
      {/* create an empty state view   */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-6 flex flex-col-reverse">
        {suggestions.length > 0 && (
          <SuggestedResults onSelect={handleSuggestionSelect} suggestions={suggestions} />
        )}
        {loading && <LoadingSpinner />}
        {chats.length > 0 ? (
          <>
            {chats.map((item) => <ChatList
              key={item.id}
              chat={item}
            />)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Welcome to Xi-Tube Search</h3>
            <p className="text-center max-w-md">
              Start by typing your search query in the box below. We'll help you find what you're looking for!
            </p>
          </div>
        )}
      </div>
      <div className="p-6">
        <SearchInput loading={loading} setLoading={setLoading} onSearch={handleSearch} />
      </div>
    </div>
  );
}
