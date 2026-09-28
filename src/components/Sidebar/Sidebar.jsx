"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";

import { useUI } from "@/context/UIContext";
import { useChat } from "@/context/ChatContext";

export default function Sidebar() {
  const { sidebarOpen } = useUI();

  const {
    conversations,
    currentChatId,
    newChat,
    switchChat,
    renameChat,
    deleteChat,
  } = useChat();

  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredChats = conversations.filter((chat) =>
    (chat.title || "New Chat")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleNewChat = () => {
    newChat();
    setSelectedChat(null);
  };

  const openChatMenu = (chatId) => {
    setSelectedChat(
      selectedChat === chatId ? null : chatId
    );
  };

  const startRename = (chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title || "New Chat");
    setSelectedChat(null);
  };

  const saveRename = () => {
    if (!editingChat) return;

    const title = editTitle.trim();

    if (title) {
      renameChat(editingChat, title);
    }

    setEditingChat(null);
    setEditTitle("");
  };

  const cancelRename = () => {
    setEditingChat(null);
    setEditTitle("");
  };

  const handleDelete = (chatId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmed) return;

    deleteChat(chatId);
    setSelectedChat(null);
  };

  return (
    <motion.aside
      animate={{
        width: sidebarOpen ? 300 : 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="h-full shrink-0 overflow-visible border-r border-white/10 bg-[#0B0D14]"
    >
      <div className="flex h-full w-[300px] flex-col">

        {/* NEW CHAT */}
        <div className="p-4">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition"
          >
            <FiPlus size={18} />
            New Chat
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-4">
          <div className="flex items-center rounded-xl bg-zinc-900 px-3 py-2">
            <FiSearch className="mr-2 text-zinc-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search chats..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* HISTORY */}
        <div className="mt-5 flex-1 overflow-y-auto px-3">

          <div className="mb-2 px-2 text-sm text-zinc-500">
            Recent Chats
          </div>

          {filteredChats.map((chat) => {

            const active =
              chat.id === currentChatId;

            const editing =
              chat.id === editingChat;

            return (
              <div
                key={chat.id}
                className={`relative mb-1 rounded-lg ${
                  active
                    ? "bg-zinc-800"
                    : "hover:bg-zinc-900"
                }`}
              >

                {/* EDIT MODE */}
                {editing ? (
                  <div className="flex items-center gap-1 p-2">

                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveRename();
                        }

                        if (e.key === "Escape") {
                          cancelRename();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-md bg-zinc-700 px-2 py-2 text-sm text-white outline-none"
                    />

                    <button
                      type="button"
                      onClick={saveRename}
                      className="rounded-md p-2 text-green-400 hover:bg-zinc-700"
                    >
                      <FiCheck size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={cancelRename}
                      className="rounded-md p-2 text-zinc-400 hover:bg-zinc-700"
                    >
                      <FiX size={16} />
                    </button>

                  </div>
                ) : (

                  /* NORMAL CHAT */
                  <div className="flex items-center">

                    <button
                      type="button"
                      onClick={() =>
                        switchChat(chat.id)
                      }
                      className="flex min-w-0 flex-1 items-center gap-2 px-3 py-3 text-left"
                    >
                      <FiMessageSquare
                        size={16}
                        className="shrink-0 text-zinc-400"
                      />

                      <span className="truncate text-sm text-white">
                        {chat.title || "New Chat"}
                      </span>
                    </button>

                    {/* MENU BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        openChatMenu(chat.id)
                      }
                      className="mr-2 flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      title="Chat options"
                    >
                      <span className="text-xl leading-none">
                        ⋮
                      </span>
                    </button>

                  </div>
                )}

                {/* MENU */}
                {selectedChat === chat.id &&
                  !editing && (
                    <div className="absolute right-2 top-11 z-[9999] w-40 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">

                      <button
                        type="button"
                        onClick={() =>
                          startRename(chat)
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-zinc-800"
                      >
                        <FiEdit2 size={16} />
                        Rename
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(chat.id)
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 hover:bg-zinc-800"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>

                    </div>
                  )}

              </div>
            );
          })}

        </div>

        {/* FOOTER */}
        <div className="border-t border-zinc-800 p-4">

          <button
            type="button"
            className="mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-white hover:bg-zinc-800"
          >
            <FiSettings size={18} />
            Settings
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-3 text-white hover:bg-zinc-800"
          >
            <FiUser size={18} />
            Profile
          </button>

        </div>

      </div>
    </motion.aside>
  );
}