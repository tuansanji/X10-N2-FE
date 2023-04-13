import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token
        }
    }
})

export const {setToken} = authSlice.actions

export default authSlice.reducer