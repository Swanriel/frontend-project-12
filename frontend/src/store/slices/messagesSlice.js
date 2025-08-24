import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import { filterProfanity } from '../../utils/profanityFilter';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await api.get('/messages');
    console.log(JSON.stringify(response.data,null,2))
    return response.data;
  }
);

export const sendNewMessage = createAsyncThunk(
  'messages/sendNewMessage',
  async (messageData, { rejectWithValue, dispatch }) => {
    try {
      const originalText = messageData.body;
      const filteredText = filterProfanity(originalText);
      
      if (filteredText !== originalText) {
        toast.info(i18n.t('notifications.profanityFiltered'));
      }

      // ДОБАВЛЯЕМ username обратно
      const username = localStorage.getItem('username') || 'user';
      
      const messageToSend = {
        body: filteredText,
        channelId: messageData.channelId,
        username: username // ← ВОЗВРАЩАЕМ username
      };

      console.log('🔄 Отправка сообщения:', messageToSend);
      
      const response = await api.post('/messages', messageToSend);
      
      console.log('✅ Ответ сервера:', response.data);
      
      dispatch(fetchMessages());
      
      toast.success(i18n.t('notifications.messageSent'));
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка отправки:', error.response?.data);
      toast.error(error.response?.data?.message || i18n.t('notifications.error'));
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