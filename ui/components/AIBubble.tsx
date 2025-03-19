"use client";

import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { Chat } from '../types/types';

export default function    AIBubble({ chat }: { chat: Chat }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4 relative">
            <p className="text-black">
                {chat.message}
            </p>
            <div className="absolute bottom-2 right-2 cursor-pointer" onClick={handlePlay}>
                {isPlaying ? <Volume2 className="h-4 w-4 text-gray-600" /> : <VolumeX className="h-4 w-4 text-gray-600" />}
            </div>
        </div>
    );
} 