import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageProps {
  id: number;
  text: string;
  type?: string;
  timestamp: string;
}

interface Chat {
  id: string;
  messages: MessageProps[];
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  error: string | null;
}

const loadChatsFromStorage = (): ChatState => {
  try {
    const storedChats = localStorage.getItem("chats");
    const storedActiveChat = localStorage.getItem("activeChatId");

    const chats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const activeChatId = storedActiveChat
      ? JSON.parse(storedActiveChat)
      : chats.length > 0
      ? chats[0].id
      : null;

    return {
      chats,
      activeChatId,
      error: null
    };
  } catch (error) {
    console.error("Error loading chats from storage:", error);
    return {
      chats: [],
      activeChatId: null,
      error: null
    };
  }
};

const saveChatsToStorage = (chats: Chat[], activeChatId: string | null) => {
  try {
    const sanitizedChats = chats.map((chat) => ({
      ...chat,
      messages: chat.messages.map(({ ...msg }) => msg)
    }));

    localStorage.setItem("chats", JSON.stringify(sanitizedChats));
    localStorage.setItem("activeChatId", JSON.stringify(activeChatId));
  } catch (error) {
    console.error("Error saving chats to storage:", error);
  }
};

const generateChatId = () => `chat-${Date.now()}`;
const generateMessageId = (messages: MessageProps[]) =>
  messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;

const initialState: ChatState = loadChatsFromStorage();

if (initialState.chats.length === 0) {
  const newChat: Chat = { id: generateChatId(), messages: [] };
  initialState.chats.push(newChat);
  initialState.activeChatId = newChat.id;
  saveChatsToStorage(initialState.chats, initialState.activeChatId);
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createNewChat: (state) => {
      const newChat: Chat = { id: generateChatId(), messages: [] };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
      saveChatsToStorage(state.chats, state.activeChatId);
    },

    addMessage: (
      state,
      action: PayloadAction<{
        text: string;
      }>
    ) => {
      if (!state.activeChatId) {
        const newChat: Chat = { id: generateChatId(), messages: [] };
        state.chats.unshift(newChat);
        state.activeChatId = newChat.id;
      }

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: generateMessageId(chat.messages),
        text: action.payload.text,
        type: "user",
        timestamp: new Date().toISOString()
      });

      saveChatsToStorage(state.chats, state.activeChatId);
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);

      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null;
      }

      saveChatsToStorage(state.chats, state.activeChatId);
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  createNewChat,
  setActiveChat,
  addMessage,
  deleteChat,
  setError
} = chatSlice.actions;
