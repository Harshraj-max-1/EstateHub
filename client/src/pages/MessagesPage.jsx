import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, User, Building, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { formatRelativeTime, getInitials, getImageUrl } from '../utils/formatters';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import api from '../api/axios';

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvIdFromQuery = searchParams.get('conv');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all user conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0) {
          const selected = activeConvIdFromQuery
            ? res.data.conversations.find((c) => c._id === activeConvIdFromQuery) || res.data.conversations[0]
            : res.data.conversations[0];
          setActiveConversation(selected);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/messages/${activeConversation._id}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    if (socket) {
      socket.emit('join_conversation', activeConversation._id);
    }

    return () => {
      if (socket) {
        socket.emit('leave_conversation', activeConversation._id);
      }
    };
  }, [activeConversation?._id, socket]);

  // Socket listener for new messages & typing
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (activeConversation && msg.conversation === activeConversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
      // Update conversations list last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation
            ? { ...c, lastMessageText: msg.content, lastMessageAt: new Date() }
            : c
        )
      );
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (activeConversation?._id === conversationId && userId !== user._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId, userId }) => {
      if (activeConversation?._id === conversationId && userId !== user._id) {
        setIsTyping(false);
      }
    };

    socket.on('new_message_received', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('new_message_received', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [socket, activeConversation?._id, user?._id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const otherParticipant = activeConversation.participants.find((p) => p._id !== user._id);
    if (!otherParticipant) return;

    const text = newMessage;
    setNewMessage('');

    if (socket) {
      socket.emit('stop_typing', {
        conversationId: activeConversation._id,
        userId: user._id
      });
      socket.emit('send_direct_message', {
        conversationId: activeConversation._id,
        senderId: user._id,
        receiverId: otherParticipant._id,
        content: text
      });
    } else {
      try {
        const res = await api.post('/messages', {
          conversationId: activeConversation._id,
          receiverId: otherParticipant._id,
          content: text
        });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getOtherParticipant = (conv) => {
    return conv?.participants?.find((p) => p._id !== user?._id) || {};
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Direct Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Chat in real-time with property agents and prospective buyers.
        </p>
      </div>

      {loadingConv ? (
        <div className="h-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse flex items-center justify-center text-xs text-slate-400">
          Loading conversations...
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Conversations Yet"
          description="Start a chat directly from any property details page by clicking the 'Contact Agent' or 'Chat' button."
          actionLabel="Browse Properties"
          onAction={() => (window.location.href = '/properties')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden h-[650px]">
          {/* Left Sidebar: Conversations List */}
          <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Chats ({conversations.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConversation?._id === conv._id;
                const isOnline = onlineUsers.includes(other._id);

                return (
                  <div
                    key={conv._id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setSearchParams({ conv: conv._id });
                    }}
                    className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {other.avatar ? (
                        <img
                          src={other.avatar}
                          alt={other.name}
                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {getInitials(other.name)}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {other.name || 'User'}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>

                      {conv.property && (
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 truncate block">
                          Re: {conv.property.title}
                        </span>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.lastMessageText || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Chat Window */}
          <div className="lg:col-span-2 flex flex-col h-full bg-white dark:bg-slate-900">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {getOtherParticipant(activeConversation).avatar ? (
                        <img
                          src={getOtherParticipant(activeConversation).avatar}
                          alt={getOtherParticipant(activeConversation).name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {getInitials(getOtherParticipant(activeConversation).name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {getOtherParticipant(activeConversation).name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {onlineUsers.includes(getOtherParticipant(activeConversation)._id) ? (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online Now
                          </span>
                        ) : (
                          'Offline'
                        )}
                      </p>
                    </div>
                  </div>

                  {activeConversation.property && (
                    <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <Building className="w-4 h-4 text-indigo-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {activeConversation.property.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message History */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/30 dark:bg-slate-950/20">
                  {loadingMessages ? (
                    <div className="text-center text-xs text-slate-400 my-auto">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 my-auto">
                      Say hello to {getOtherParticipant(activeConversation).name}!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col max-w-[80%] ${
                            isMe ? 'self-end items-end' : 'self-start items-start'
                          }`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {formatRelativeTime(msg.createdAt)}
                          </span>
                        </div>
                      );
                    })
                  )}
                  {isTyping && (
                    <div className="self-start text-[11px] text-slate-400 italic">
                      {getOtherParticipant(activeConversation).name} is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      if (socket) {
                        socket.emit('typing', {
                          conversationId: activeConversation._id,
                          userId: user._id,
                          userName: user.name
                        });
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <Button type="submit" variant="primary" size="md" icon={Send}>
                    Send
                  </Button>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
