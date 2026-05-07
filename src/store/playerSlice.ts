import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
    data: any | null;
    awardsData: any | null;
    unlocksData: any | null;
    liveData: any | null;
    loading: boolean;
}

const initialState: PlayerState = {
    data: null,
    awardsData: null,
    unlocksData: null,
    liveData: null,
    loading: false,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPlayerData: (state, action: PayloadAction<{data: any, awards: any, unlocks: any, live: any}>) => {
            state.data = action.payload.data;
            state.awardsData = action.payload.awards;
            state.unlocksData = action.payload.unlocks;
            state.liveData = action.payload.live;
        }
    },
});

export const { setLoading, setPlayerData } = playerSlice.actions;
export default playerSlice.reducer;