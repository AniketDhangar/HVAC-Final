// userslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
  token: null,
  loading: false,
  error: null,
  // Add session tracking
  sessions: {},
  currentSession: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { loggedUser, token, isLoggedIn } = action.payload;
      console.log('Setting user in Redux:', { loggedUser, token, isLoggedIn });
      
      // Create a unique session ID
      const sessionId = `${loggedUser.role}-${Date.now()}`;
      
      // Store the session
      state.sessions[sessionId] = {
        userData: loggedUser,
        token: token,
        isLoggedIn: isLoggedIn
      };
      
      // Set current session
      state.currentSession = sessionId;
      state.userData = loggedUser;
      state.token = token;
      state.isLoggedIn = isLoggedIn;
      state.loading = false;
      state.error = null;
    },
    switchSession: (state, action) => {
      const { sessionId } = action.payload;
      if (state.sessions[sessionId]) {
        state.currentSession = sessionId;
        state.userData = state.sessions[sessionId].userData;
        state.token = state.sessions[sessionId].token;
        state.isLoggedIn = state.sessions[sessionId].isLoggedIn;
      }
    },
   logout: (state, action) => {
  const sessionId = action?.payload?.sessionId;
  console.log('Logging out user from session:', sessionId);

  if (sessionId) {
    // Remove specific session
    delete state.sessions[sessionId];

    // If logging out current session, switch to another if available
    if (state.currentSession === sessionId) {
      const remainingSessions = Object.keys(state.sessions);
      if (remainingSessions.length > 0) {
        state.currentSession = remainingSessions[0];
        const activeSession = state.sessions[state.currentSession];
        state.userData = activeSession.userData;
        state.token = activeSession.token;
        state.isLoggedIn = activeSession.isLoggedIn;
      } else {
        // No sessions left
        state.userData = null;
        state.token = null;
        state.isLoggedIn = false;
        state.currentSession = null;
      }
    }
  } else {
    // Clear all sessions
    state.sessions = {};
    state.userData = null;
    state.token = null;
    state.isLoggedIn = false;
    state.currentSession = null;
  }

  state.loading = false;
  state.error = null;
}
,
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { setUser, logout, setLoading, setError, switchSession } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.userData;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectToken = (state) => state.user.token;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectSessions = (state) => state.user.sessions;
export const selectCurrentSession = (state) => state.user.currentSession;

export default userSlice.reducer;
