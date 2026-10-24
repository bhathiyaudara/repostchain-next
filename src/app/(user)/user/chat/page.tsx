'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2, Send } from 'lucide-react';

export default function CollabChatPage() {
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Record<string, boolean>>({});

  const { data: convData } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      const res = await fetch('/api/user/chat');
      if (!res.ok) throw new Error('Failed to load conversations');
      return res.json();
    },
  });

  const conversations = convData?.conversations || [];
  const activeConversationId = selectedConversationId || conversations[0]?.id || null;

  const { data: msgData } = useQuery({
    queryKey: ['chat-messages', activeConversationId],
    enabled: !!activeConversationId,
    queryFn: async () => {
      const res = await fetch(`/api/user/chat?conversationId=${activeConversationId}`);
      if (!res.ok) throw new Error('Failed to load messages');
      return res.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      setErrorMessage(null);
      const res = await fetch('/api/user/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          body: newMessage,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      return json;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['chat-messages', activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message);
    },
  });

  const activeConversation = conversations.find(
    (c: { id: string }) => String(c.id) === String(activeConversationId)
  );
  const messages = msgData?.messages || [];

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Exact match to resources/views/livewire/user/collab-chat.blade.php */}
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 py-24 bg-white dark:bg-slate-950">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="88"
            height="88"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-4"
          >
            <circle cx="12" cy="12" r="12" fill="#FFEDE0" />
            <path
              d="M17 8.5H7a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h1.2L8 18l3.2-2.5H17a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 17 8.5Z"
              fill="#FF5500"
            />
            <circle cx="9" cy="12" r="0.9" fill="white" />
            <circle cx="12" cy="12" r="0.9" fill="white" />
            <circle cx="15" cy="12" r="0.9" fill="white" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collab Chat</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Just chat for collaboration and music knowledge sharing — no external links. Only
            SoundCloud, Spotify and YouTube links allowed.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            No conversations yet — visit an artist&apos;s profile and hit &ldquo;Send
            Message&rdquo; to start one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row" style={{ height: '75vh' }}>
          {/* Conversation list */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-y-auto">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collab Chat</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Chat for collaboration and sharing music knowledge.
              </p>
            </div>
            {conversations.map(
              (c: {
                id: string;
                otherUser?: { name?: string; avatar?: string };
                lastMessage?: string;
              }) => {
                const isSelected = String(activeConversationId) === String(c.id);
                const isPinned = !!pinnedIds[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConversationId(String(c.id))}
                    className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer ${
                      isSelected ? 'bg-slate-50 dark:bg-slate-900' : ''
                    }`}
                  >
                    <img
                      src={c.otherUser?.avatar || '/default_img/no_img.jpg'}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      alt={c.otherUser?.name || 'Artist'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-slate-900 dark:text-white truncate">
                          {c.otherUser?.name || 'SoundCloud Artist'}
                        </span>
                        {isPinned && (
                          <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500] shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {c.lastMessage || 'Say hi 👋'}
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-0">
            {activeConversationId ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConversation?.otherUser?.avatar || '/default_img/no_img.jpg'}
                      className="w-9 h-9 rounded-full object-cover"
                      alt=""
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/default_img/no_img.jpg';
                      }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {activeConversation?.otherUser?.name || 'Artist'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPinnedIds((prev) => ({
                        ...prev,
                        [activeConversationId]: !prev[activeConversationId],
                      }))
                    }
                    title="Pin conversation"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                      pinnedIds[activeConversationId]
                        ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-500'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        pinnedIds[activeConversationId] ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                  {messages.length > 0 ? (
                    messages.map(
                      (m: {
                        id: string;
                        sender_urn: string;
                        body: string;
                        created_at?: string;
                        isMine?: boolean;
                      }) => {
                        const isMine =
                          m.isMine ?? m.sender_urn === 'soundcloud:users:999001';
                        return (
                          <div
                            key={m.id}
                            className={`flex ${
                              isMine ? 'justify-end' : 'justify-start'
                            } group py-1`}
                          >
                            <div
                              className={`flex items-center gap-1.5 max-w-[70%] ${
                                isMine ? 'flex-row-reverse' : 'flex-row'
                              }`}
                            >
                              {isMine && (
                                <button
                                  type="button"
                                  title="Delete message"
                                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-500 shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isMine
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <p className="text-sm break-words">{m.body}</p>
                                <p className="text-[10px] opacity-70 mt-1">
                                  {m.created_at
                                    ? new Date(m.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'Just now'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                      <p className="font-semibold text-slate-900 dark:text-white">Say hi 👋</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Start the conversation by sending a message.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
                  {errorMessage && (
                    <p className="text-xs text-red-500 mb-2">{errorMessage}</p>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newMessage.trim()) sendMutation.mutate();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={sendMutation.isPending}
                      className="shrink-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center cursor-pointer"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
