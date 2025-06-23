import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ lưu lại user
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user"); // ✅ xóa user khi logout
    },
  },
});


export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
