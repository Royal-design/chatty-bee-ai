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
  userId: string | null;
}

// Generate storage key based on user ID
const getStorageKey = (userId: string | null) => `chats-${userId || "guest"}`;

// Load state from localStorage for a specific user
const loadChatsFromStorage = (userId: string | null): ChatState => {
  try {
    const storageKey = getStorageKey(userId);
    const storedChats = localStorage.getItem(storageKey);
    const storedActiveChat = localStorage.getItem(`activeChatId-${userId}`);
    const storedModel =
      localStorage.getItem(`model-${userId}`) || "gemini-2.0-flash";

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
      aiLoading: false,
      userId
    };
  } catch (error) {
    console.error("Error loading chats:", error);
    return {
      chats: [],
      activeChatId: null,
      model: "gemini-2.0-flash",
      error: "Failed to load chats.",
      loading: false,
      aiLoading: false,
      userId
    };
  }
};

// Save state to localStorage for the specific user
const saveChatsToStorage = (state: ChatState): void => {
  try {
    if (!state.userId) return; // Prevent saving if userId is null

    const storageKey = getStorageKey(state.userId);
    localStorage.setItem(storageKey, JSON.stringify(state.chats));
    localStorage.setItem(
      `activeChatId-${state.userId}`,
      JSON.stringify(state.activeChatId)
    );
    localStorage.setItem(`model-${state.userId}`, state.model);
  } catch (error) {
    console.error("Error saving chats:", error);
  }
};

// ID Generators
const generateChatId = (): string => `chat-${Date.now()}`;
const generateMessageId = (messages: MessageProps[]): number =>
  messages.length ? messages[messages.length - 1].id + 1 : 1;

// Initial state
const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  model: "gemini-2.0-flash",
  error: null,
  loading: false,
  aiLoading: false,
  userId: null
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // ✅ Set the user ID and load their chat history
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      const newState = loadChatsFromStorage(action.payload);
      state.chats = newState.chats;
      state.activeChatId = newState.activeChatId;
      state.model = newState.model;
      state.error = newState.error;
    },

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
  setUserId,
  createNewChat,
  setActiveChat,
  addMessage,
  deleteChat,
  setError,
  setModel,
  setLoading,
  setAiLoading
} = chatSlice.actions;
