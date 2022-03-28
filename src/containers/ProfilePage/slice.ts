import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchAPI, fetchAPINoResponse } from '../../common/http';
import { AchievementTypes, BadgeTypes, DisplayGroup, DisplayItem, Profile } from '../../common/types';
import { onDragDrop } from '../../providers/DragDropProvider/slice';
import { nanoid } from 'nanoid';
import { AsyncStates } from '../../common/constants';
import {
  getAchievement,
  getFungibleToken,
  getNonFungibleToken,
  getProfilePicture,
  getStatistic,
} from './ModalForms/slice';

export interface State {
  loadProfileState: AsyncStates;
  saveProfileState: AsyncStates;
  showEditBar: boolean;
  profile: Profile;
}

// some pre-amble about the relationship between display_config and interactions/non_fungible_tokens/fungible_tokens/statistics:
//
// picture, groups and achievements maintain pointers to objects within the above mentioned arrays
// with the current code, no two items within the display config should point to the same item in the arrays
// that means that a picture pointing to an nft and a group item pointing to the same nft should be two distinct objects in the non_fungible_tokens array
// this design is because the logic for adding/removing items from the arrays does not account for shared pointers and is more complicated than I want to support right now
// it is slightly less optimal for us on the backend because we have to make external calls to validate/hydrate the same nft twice but I'm okay with this for now.
const initialState: State = {
  loadProfileState: AsyncStates.PENDING,
  saveProfileState: AsyncStates.READY,
  showEditBar: false,
  profile: {
    address: '',
    ens_name: '',
    store_assets: {
      premium: false,
      beta_tester: false,
    },
    display_config: {
      colors: {
        primary: '',
        secondary: '',
        primary_text: '',
        secondary_text: '',
      },
      text: {
        title: '',
        description: '',
      },
      picture: {
        item: undefined,
      },
      achievements: {
        text: '',
        items: [],
      },
      groups: [],
    },
    interactions: [],
    non_fungible_tokens: [],
    fungible_tokens: [],
    statistics: [],
  },
};

export const loadProfile = createAsyncThunk<Profile, { address: string }, { state: RootState }>(
  'profile/load',
  async ({ address }) => {
    return fetchAPI<Profile>(`/profiles/${address}`);
  }
);

export const saveProfile = createAsyncThunk<void, { address: string; library: any }, { state: RootState }>(
  'profile/save',
  async ({ address, library }, { getState }) => {
    const { profilePage } = getState();

    const { message } = await fetchAPI<{ message: string }>(`/challenges/${address}`);

    const signer = library.getSigner(address);
    const signature = await signer.signMessage(message);

    await fetchAPINoResponse(`/profiles/${address}`, {
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
    openEditBar: (state) => {
      state.showEditBar = true;
    },
    closeEditBar: (state) => {
      state.showEditBar = false;
    },
    updateProfileTitle: (state, action: PayloadAction<string>) => {
      state.profile.display_config.text.title = action.payload;
    },
    updateProfileDescription: (state, action: PayloadAction<string>) => {
      state.profile.display_config.text.description = action.payload;
    },
    removeProfilePicture: (state) => {
      state.profile.display_config.picture.item = undefined;
    },
    updatePrimaryColor: (state, action: PayloadAction<string>) => {
      state.profile.display_config.colors.primary = action.payload;
    },
    updateSecondaryColor: (state, action: PayloadAction<string>) => {
      state.profile.display_config.colors.secondary = action.payload;
    },
    updatePrimaryTextColor: (state, action: PayloadAction<string>) => {
      state.profile.display_config.colors.primary_text = action.payload;
    },
    updateSecondaryTextColor: (state, action: PayloadAction<string>) => {
      state.profile.display_config.colors.secondary_text = action.payload;
    },
    updateGroupText: (state, action: PayloadAction<{ index: number; text: string }>) => {
      state.profile.display_config.groups[action.payload.index].text = action.payload.text;
    },
    addGroup: (state) => {
      state.profile.display_config.groups = [
        { id: nanoid(), text: '', items: [] },
        ...state.profile.display_config.groups,
      ];
    },
    removeGroup: (state, action: PayloadAction<number>) => {
      const groups = state.profile.display_config.groups;
      for (const itemBeingDeleted of groups[action.payload].items) {
        removeBadge(state, itemBeingDeleted);
      }
      groups.splice(action.payload, 1);
    },
    removeItem: (state, action: PayloadAction<{ groupArrayIndex: number; itemArrayIndex: number }>) => {
      const group = state.profile.display_config.groups[action.payload.groupArrayIndex];
      removeBadge(state, group.items[action.payload.itemArrayIndex]);
      group.items.splice(action.payload.itemArrayIndex, 1);
    },
    updateAchievementText: (state, action: PayloadAction<string>) => {
      state.profile.display_config.achievements.text = action.payload;
    },
    removeAchievement: (state, action: PayloadAction<number>) => {
      const achievements = state.profile.display_config.achievements.items;
      const achievementBeingDeleted = achievements[action.payload];
      for (const achievement of achievements) {
        if (achievement.type === achievementBeingDeleted.type && achievement.index > achievementBeingDeleted.index) {
          achievement.index--;
        }
      }
      achievements.splice(action.payload, 1);
      state.profile[achievementBeingDeleted.type].splice(achievementBeingDeleted.index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, () => {
        return initialState;
      })
      .addCase(loadProfile.rejected, (state) => {
        state.loadProfileState = AsyncStates.REJECTED;
      })
      .addCase(loadProfile.fulfilled, (state, { payload: profile }) => {
        state.loadProfileState = AsyncStates.FULFILLED;
        state.profile.address = profile.address;
        state.profile.ens_name = profile.ens_name;
        state.profile.store_assets = profile.store_assets;
        state.profile.non_fungible_tokens = profile.non_fungible_tokens;
        state.profile.fungible_tokens = profile.fungible_tokens;
        state.profile.statistics = profile.statistics;
        state.profile.interactions = profile.interactions;
        if (!profile.display_config) {
          buildDefaultDisplayConfig(state.profile, profile);
        } else {
          state.profile.display_config = profile.display_config;
        }
      })
      .addCase(saveProfile.pending, (state, _) => {
        state.saveProfileState = AsyncStates.PENDING;
      })
      .addCase(saveProfile.rejected, (state, _) => {
        state.saveProfileState = AsyncStates.REJECTED;
      })
      .addCase(saveProfile.fulfilled, (state, _) => {
        state.saveProfileState = AsyncStates.FULFILLED;
        state.showEditBar = false;
      })
      .addCase(onDragDrop, (state, { payload }) => {
        const { source, destination } = payload;

        if (!destination) {
          return;
        }

        const sourceGroupId = +source.droppableId;
        const destinationGroupId = +destination.droppableId;
        const sourceGroup = state.profile.display_config.groups[sourceGroupId].items;
        const destinationGroup = state.profile.display_config.groups[destinationGroupId].items;

        if (sourceGroupId === destinationGroupId) {
          const [removed] = sourceGroup.splice(source.index, 1);
          sourceGroup.splice(destination.index, 0, removed);
        } else {
          const [removed] = sourceGroup.splice(source.index, 1);
          destinationGroup.splice(destination.index, 0, removed);
        }
      })
      .addCase(getNonFungibleToken.fulfilled, (state, { payload }) => {
        addBadge(state, BadgeTypes.NonFungibleToken, payload);
      })
      .addCase(getFungibleToken.fulfilled, (state, { payload }) => {
        addBadge(state, BadgeTypes.FungibleToken, payload);
      })
      .addCase(getStatistic.fulfilled, (state, { payload }) => {
        addBadge(state, BadgeTypes.Statistics, payload);
      })
      .addCase(getProfilePicture.fulfilled, (state, { payload }) => {
        // remove the old profile picture config
        if (state.profile.display_config.picture.item) {
          removeBadge(state, state.profile.display_config.picture.item);
        }
        state.profile.non_fungible_tokens.push(payload);
        state.profile.display_config.picture.item = {
          id: nanoid(),
          index: state.profile.non_fungible_tokens.length - 1,
          type: BadgeTypes.NonFungibleToken,
        };
      })
      .addCase(getAchievement.fulfilled, (state, { payload }) => {
        state.profile.interactions.push(payload);
        state.profile.display_config.achievements.items.push({
          id: nanoid(),
          index: state.profile.interactions.length - 1,
          type: AchievementTypes.Interactions,
        });
      });
  },
});

// build a pleasant display config when the user does not have one configured
function buildDefaultDisplayConfig(stateProfile: Profile, actionProfile: Profile): void {
  stateProfile.display_config.text.title = '💎 My Profile 💎';
  stateProfile.display_config.text.description = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  `;
  stateProfile.display_config.colors = {
    primary: '#121212',
    secondary: '#1a1a1b',
    primary_text: '#FFF',
    secondary_text: '#FFF',
  };
  stateProfile.display_config.groups = [];

  for (let i = 0; i < actionProfile.interactions.length; i++) {
    stateProfile.display_config.achievements.text = 'Achievements';
    stateProfile.display_config.achievements.items.push({
      id: nanoid(),
      index: i,
      type: AchievementTypes.Interactions,
    });
  }

  if (actionProfile.statistics.length > 0) {
    const group: DisplayGroup = {
      id: nanoid(),
      text: 'Stats',
      items: [],
    };
    for (let i = 0; i < actionProfile.statistics.length; i++) {
      group.items.push({
        id: nanoid(),
        index: i,
        type: BadgeTypes.Statistics,
      });
    }
    stateProfile.display_config.groups.push(group);
  }

  if (actionProfile.non_fungible_tokens.length > 0) {
    stateProfile.display_config.picture.item = {
      id: nanoid(),
      index: 0,
      type: BadgeTypes.NonFungibleToken,
    };
    const group: DisplayGroup = {
      id: nanoid(),
      text: 'Non Fungibles',
      items: [],
    };
    // we start at 1 because the profile picture has claimed item 0 in the display config
    for (let i = 1; i < actionProfile.non_fungible_tokens.length; i++) {
      group.items.push({
        id: nanoid(),
        index: i,
        type: BadgeTypes.NonFungibleToken,
      });
    }
    stateProfile.display_config.groups.push(group);
  }

  if (actionProfile.fungible_tokens.length > 0) {
    const group: DisplayGroup = {
      id: nanoid(),
      text: 'Tokens',
      items: [],
    };
    for (let i = 0; i < actionProfile.fungible_tokens.length; i++) {
      group.items.push({
        id: nanoid(),
        index: i,
        type: BadgeTypes.FungibleToken,
      });
    }
    stateProfile.display_config.groups.push(group);
  }
}

// fix the pointers of all other items that are affected by the badge type being removed from the array
// splice the item being deleted out of the array for the given badge type
function removeBadge(state: State, itemBeingDeleted: DisplayItem) {
  const picture = state.profile.display_config.picture;
  if (
    BadgeTypes.NonFungibleToken === itemBeingDeleted.type &&
    picture.item &&
    picture.item.index > itemBeingDeleted.index
  ) {
    picture.item.index--;
  }

  for (const group of state.profile.display_config.groups) {
    for (const item of group.items) {
      if (item.type === itemBeingDeleted.type && item.index > itemBeingDeleted.index) {
        item.index--;
      }
    }
  }

  state.profile[itemBeingDeleted.type].splice(itemBeingDeleted.index, 1);
}

// add the badge to the bottom of the specified badge type array
// add an item at the front of the first group
// if the group does not exist, create one
function addBadge(state: State, type: BadgeTypes, badge: any) {
  state.profile[type].push(badge);
  const groups = state.profile.display_config.groups;
  const item = {
    id: nanoid(),
    index: state.profile[type].length - 1,
    type,
  };
  if (groups.length === 0) {
    groups.push({
      id: nanoid(),
      text: '',
      items: [item],
    });
  } else {
    groups[0].items = [item, ...groups[0].items];
  }
}

export const selectLoading = (state: RootState) => state.profilePage.loadProfileState === AsyncStates.PENDING;

export const selectError = (state: RootState) => state.profilePage.loadProfileState === AsyncStates.REJECTED;

export const selectSaving = (state: RootState) => state.profilePage.saveProfileState === AsyncStates.PENDING;

export const selectShowEditBar = (state: RootState) => state.profilePage.showEditBar;

export const selectText = (state: RootState) => state.profilePage.profile.display_config.text;

export const selectColors = (state: RootState) => state.profilePage.profile.display_config.colors;

export const selectPicture = (state: RootState) => state.profilePage.profile.display_config.picture;

export const selectGroups = (state: RootState) => state.profilePage.profile.display_config.groups;

export const selectAchievements = (state: RootState) => state.profilePage.profile.display_config.achievements;

export const selectAddress = (state: RootState) => state.profilePage.profile.address;

export const selectENSName = (state: RootState) => state.profilePage.profile.ens_name;

export const selectStoreAssets = (state: RootState) => state.profilePage.profile.store_assets;

export const selectNonFungibleTokens = (state: RootState) => state.profilePage.profile.non_fungible_tokens;

export const selectNonFungibleToken = (state: RootState, index: number) =>
  state.profilePage.profile.non_fungible_tokens[index];

export const selectFungibleToken = (state: RootState, index: number) =>
  state.profilePage.profile.fungible_tokens[index];

export const selectStatistic = (state: RootState, index: number) => state.profilePage.profile.statistics[index];

export const selectInteraction = (state: RootState, index: number) => state.profilePage.profile.interactions[index];

export default slice.reducer;

export const {
  openEditBar,
  closeEditBar,
  updateProfileTitle,
  updateProfileDescription,
  updatePrimaryColor,
  updateSecondaryColor,
  updatePrimaryTextColor,
  updateSecondaryTextColor,
  updateGroupText,
  addGroup,
  removeGroup,
  removeItem,
  updateAchievementText,
  removeAchievement,
} = slice.actions;
