import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await axios.get('http://localhost:3005/users');

  // DEV ONLY!!!
  await pause(1000);

  return response.data;
});

// helpful pause function used to slow down requests a little bit
// so we can really see whats going on with some state changes that happen
// really fast otherwise.
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export { fetchUsers };
