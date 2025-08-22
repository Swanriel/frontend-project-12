import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await api.get('/messages');
    return response.data;
  }
);

// Новая функция для отправки сообщения
export const sendNewMessage = createAsyncThunk(
  'messages/sendNewMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
    sending: false
  },
  reducers: {
    addMessage: (state, action) => {
      state.items.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendNewMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.items.push(action.payload);
      })
      .addCase(sendNewMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;