import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/auth'; // Replace with your actual API base URL

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store the JWT token
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userName', data.user.name);
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

export const signupUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}; 