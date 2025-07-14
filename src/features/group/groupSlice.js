import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    loading: "",
    groups: []
};

const groupSlice = createSlice({
    name: "group",
    initialState: initialState,

    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setGroups(state, action) {
            state.groups = action.payload;
        },
        addOrReplaceGroup(state, action) {
            const newID = action.payload.id;

            const index = state.groups.findIndex((item) => item.id === newID);

            if (index === -1) state.groups.push(action.payload);
            else state.groups[index] = action.payload;
        },
        removeGroup(state, action) {
            const groupId = action.payload;
            state.groups = state.groups.filter((group) => group.id !== groupId);
        }
    }
});

export const { setLoading, setGroups, addOrReplaceGroup, removeGroup } = groupSlice.actions;
export default groupSlice.reducer;
