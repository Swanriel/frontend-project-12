import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import i18n from '../../i18n'
import { filterProfanity } from '../../utils/profanityFilter'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await api.get('/channels')
    return response.data
  },
)

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const filteredChannelData = {
        ...channelData,
        name: filterProfanity(channelData.name),
      }
      const response = await api.post('/channels', filteredChannelData)
      toast.success(i18n.t('notifications.channelCreated'))
      return response.data
    } catch (error)
    {
      toast.error(error.response?.data?.message || i18n.t('notifications.error'))
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      await api.delete(`/channels/${channelId}`)
      toast.success(i18n.t('notifications.channelRemoved'))
      return channelId
    } catch (error)
    {
      toast.error(error.response?.data?.message || i18n.t('notifications.error'))
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const filteredName = filterProfanity(name)
      const response = await api.patch(`/channels/${id}`, { name: filteredName })
      toast.success(i18n.t('notifications.channelRenamed'))
      return response.data
    } catch (error)
    {
      toast.error(error.response?.data?.message || i18n.t('notifications.error'))
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.currentChannelId = action.payload.id
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.items = state.items.filter(channel => channel.id !== action.payload)
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = state.items[0]?.id || null
        }
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = state.items.find(ch => ch.id === action.payload.id)
        if (channel) {
          channel.name = action.payload.name
        }
      })
  },
})

export const { setCurrentChannel } = channelsSlice.actions
export default channelsSlice.reducer
