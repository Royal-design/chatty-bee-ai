import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageProps {
  id: number;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

interface Chat {
  id: string;
  messages: MessageProps[];
  timestamp: string;
}

interface ChatState {
  chats: Chat[];
  model: string;
  activeChatId: string | null;
  error: string | null;
  loading: boolean;
  aiLoading: boolean;
}

// Load state from localStorage
const loadChatsFromStorage = (): ChatState => {
  try {
    const storedChats = localStorage.getItem("chats");
    const storedActiveChat = localStorage.getItem("activeChatId");
    const storedModel = localStorage.getItem("model") || "gemini-2.0-flash";

    const chats: Chat[] = storedChats ? JSON.parse(storedChats) : [];
    const activeChatId = storedActiveChat
      ? JSON.parse(storedActiveChat)
      : chats.length > 0
      ? chats[0].id
      : null;

    return {
      chats,
      activeChatId,
      model: storedModel,
      error: null,
      loading: false,
      aiLoading: false
    };
  } catch (error) {
    console.error("Error loading chats:", error);
    return {
      chats: [],
      activeChatId: null,
      model: "gemini-2.0-flash",
      error: "Failed to load chats.",
      loading: false,
      aiLoading: false
    };
  }
};

// Save state to localStorage
const saveChatsToStorage = (state: ChatState): void => {
  try {
    localStorage.setItem("chats", JSON.stringify(state.chats));
    localStorage.setItem("activeChatId", JSON.stringify(state.activeChatId));
    localStorage.setItem("model", state.model);
  } catch (error) {
    console.error("Error saving chats:", error);
  }
};

// ID Generators
const generateChatId = (): string => `chat-${Date.now()}`;
const generateMessageId = (messages: MessageProps[]): number =>
  messages.length ? messages[messages.length - 1].id + 1 : 1;

// Load initial state
const initialState: ChatState = loadChatsFromStorage();

// Ensure at least one chat exists
if (initialState.chats.length === 0) {
  const newChat: Chat = {
    id: generateChatId(),
    messages: [],
    timestamp: new Date().toISOString()
  };
  initialState.chats.push(newChat);
  initialState.activeChatId = newChat.id;
  saveChatsToStorage(initialState);
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createNewChat: (state) => {
      const newChat: Chat = {
        id: generateChatId(),
        messages: [],
        timestamp: new Date().toISOString()
      };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
      saveChatsToStorage(state);
    },

    setActiveChat: (state, action: PayloadAction<string>) => {
      if (!state.chats.some((chat) => chat.id === action.payload)) {
        state.error = "Chat not found.";
        return;
      }
      state.activeChatId = action.payload;
      saveChatsToStorage(state);
    },

    addMessage: (
      state,
      action: PayloadAction<{ text: string; type: "user" | "ai" }>
    ) => {
      if (!state.activeChatId) {
        const newChat: Chat = {
          id: generateChatId(),
          messages: [],
          timestamp: new Date().toISOString()
        };
        state.chats.unshift(newChat);
        state.activeChatId = newChat.id;
      }

      const chat = state.chats.find((chat) => chat.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: generateMessageId(chat.messages),
        text: action.payload.text,
        type: action.payload.type,
        timestamp: new Date().toISOString()
      });

      saveChatsToStorage(state);
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      state.activeChatId = state.chats.length ? state.chats[0].id : null;
      saveChatsToStorage(state);
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
      saveChatsToStorage(state);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setAiLoading: (state, action: PayloadAction<boolean>) => {
      state.aiLoading = action.payload;
    }
  }
});

export const {
  createNewChat,
  setActiveChat,
  addMessage,
  deleteChat,
  setError,
  setModel,
  setLoading,
  setAiLoading
} = chatSlice.actions;
