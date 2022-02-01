import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ProfileMode } from '../../common/constants';
import { fetchCoreAPI } from '../../api';
import { Profile } from '../../api/types';

export interface State {
  loading: boolean;
  error: boolean;
  profileMode: ProfileMode;
  profile: Profile | undefined;
}

const initialState: State = {
  loading: true,
  error: false,
  profileMode: ProfileMode.View,
  profile: undefined,
};

export const loadProfile = createAsyncThunk<Profile, { address: string }, { state: RootState }>(
  'profile/load',
  async ({ address }) => {
    const response = await fetchCoreAPI(`/profiles/${address}`);
    const profile = await response.json();
    return profile;
  }
);

export const saveProfile = createAsyncThunk<void, { address: string; library: any }, { state: RootState }>(
  'profile/save',
  async ({ address, library }, { getState }) => {
    const { profilePage } = getState();

    const response = await fetchCoreAPI(`/challenges/${address}`);
    const { message } = await response.json();

    const signer = library.getSigner(address);
    const signature = await signer.signMessage(message);

    await fetchCoreAPI(`/profiles/${address}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signature}`,
      },
      method: 'PUT',
      body: JSON.stringify(profilePage.profile),
    });
  }
);

export const slice = createSlice({
  name: 'profilePage',
  initialState,
  reducers: {
    setProfileMode: (state, action: PayloadAction<ProfileMode>) => {
      state.profileMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(loadProfile.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.profile = action.payload;
      })
      .addCase(saveProfile.fulfilled, (state, _) => {
        state.profileMode = ProfileMode.View;
      });
  },
});

export const { setProfileMode } = slice.actions;

export const selectProfile = (state: RootState) => state.profilePage;

export default slice.reducer;
