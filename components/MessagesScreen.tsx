
import React from 'react';
import { Match, Message, User } from '../types';
import { MESSAGES_DATA, MATCHES_DATA } from '../constants';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface MessagesScreenProps {
    onChatSelect: (match: Match) => void;
    user: User;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ onChatSelect, user }) => {
    
    const conversations = MESSAGES_DATA.map(conv => {
        const match = MATCHES_DATA.find(m => m.id === conv.matchId);
        const lastMessage = conv.messages[conv.messages.length - 1];
        return { match, lastMessage };
    }).filter(c => c.match && c.lastMessage);

    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + "y";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + "m";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }

    return (
        <div className="pb-24">
            <h1 className="text-2xl font-bold text-brand-dark p-4">Chats</h1>
            {conversations.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-600">No chats yet.</p>
                    <p className="text-sm text-gray-500">When you match with someone, you can start chatting here.</p>
                </div>
            ) : (
                <div>
                    {conversations.map(({ match, lastMessage }) => {
                        if (!match || !lastMessage) return null;
                        const isSentByUser = lastMessage.senderId === user.id;
                        return (
                             <div key={match.id} onClick={() => onChatSelect(match)} className="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <img src={match.profileImageUrls[0]} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                                <div className="ml-4 flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                      <h2 className="font-bold text-brand-dark">{match.name}</h2>
                                      <span className="text-xs text-gray-400 self-start">{timeSince(lastMessage.timestamp)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500 truncate">{isSentByUser ? `You: ${lastMessage.text}` : lastMessage.text}</p>
                                        {isSentByUser && user.isPremium && (
                                            <div className="flex items-center text-xs text-blue-500 ml-2 flex-shrink-0">
                                                <CheckCircleIcon className="w-4 h-4 mr-1"/>
                                                <span>Seen</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default MessagesScreen;
