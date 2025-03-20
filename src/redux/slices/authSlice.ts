import { SessionUser } from "@/types/user-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
 token: string;
 sessionUser: SessionUser;
}

const initialState: AuthState = {
 token: "",
 sessionUser: {},
};

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
  setToken(state, action: PayloadAction<string>) {
   state.token = action.payload;
  },
  setSessionUser(state, action: PayloadAction<SessionUser>) {
   state.sessionUser = action.payload;
  },
  clearAuth(state) {
   state.token = "";
   state.sessionUser = {};
  },
 },
});

export const { setToken, setSessionUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
