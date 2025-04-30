import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
}

interface AuthState {
  isAuththenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuththenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess: (state, action: PayloadAction<User>) => {
      state.isAuththenticated = true; //User is login
      state.user = action.payload; // User data store
    },
  },
});

export const { authSuccess } = authSlice.actions;
export default authSlice.reducer;
