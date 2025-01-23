import { api } from '@/boot/axios';
import {
  API_LOGIN_PATH,
  API_REGISTER_PATH,
  API_USER_PATH,
  API_CHANGE_PASSWORD_PATH,
  API_PASSWORD_RESET_CONFIRM_PATH,
} from '@/constants/routes';
import { Token, User } from '@/types';
import { storage } from '@/utils/storage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const USER_EXPIRATION = 3600; // 1 hour in seconds

  const token = ref<Token | null>(storage.get('token'));
  const user = ref<User | null>(storage.get('user'));

  const fetchUser = async () => {
    console.log('Token:', token.value);
    try {
      if (!token.value || !token.value.data) {
        throw new Error('No token available');
      }

      if (user.value) {
        return;
      }

      const response = await api.get(API_USER_PATH, {
        headers: {
          Authorization: `Bearer ${token.value?.data}`,
        },
      });
      console.log('User:', response.data);
      user.value = response.data;
      storage.set('user', user.value, {
        expiration: USER_EXPIRATION,
        version: '1.0',
      });
      console.log('User in storage:', storage.get('user'));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(API_LOGIN_PATH, { email, password });
      token.value = {
        timestamp: Date.now(),
        version: '1.0',
        expiration: USER_EXPIRATION,
        data: response.data.token,
      };
      console.log('Token after login:', token.value);
      if (token.value) {
        storage.set('token', token.value);
        await fetchUser();
      } else {
        throw new Error('Failed to retrieve token');
      }
      return response.data.message;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post(API_REGISTER_PATH, { name, email, password });
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    storage.remove('token');
    storage.remove('user');
  };

  const updateProfile = async (profileData: { name: string; email: string }) => {
    console.log('updateProfile:', token.value?.data);
    try {
      const response = await api.put(API_USER_PATH, profileData, {
        headers: {
          Authorization: `Bearer ${token.value?.data}`,
        },
      });
      const updatedUser = response.data.user;
      user.value = {
        name: updatedUser.name,
        email: updatedUser.email,
      };
      storage.set('user', {
        ...user.value,
        timestamp: Date.now(),
        version: '1.0',
        expiration: USER_EXPIRATION,
      });
      return response.data.message;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    console.log('Token:', token.value);
    try {
      if (!token.value || !token.value.data) {
        throw new Error('No token available');
      }

      console.log('Token:', token.value.data);

      const response = await api.put(
        API_CHANGE_PASSWORD_PATH,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token.value?.data}`,
          },
        },
      );
      return response.data.message;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string | null, token: string | null, newPassword: string) => {
    try {
      const response = await api.post(API_PASSWORD_RESET_CONFIRM_PATH, {
        email,
        token,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  };

  return {
    token,
    user,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    resetPassword,
  };
});
