import { api } from '@/boot/axios';
import {
  API_LOGIN_PATH,
  API_REGISTER_PATH,
  // LOGIN_PATH,
  API_USER_PATH,
  API_CHANGE_PASSWORD_PATH,
} from '@/constants/routes';
import { Token, User } from '@/types';
import { storage } from '@/utils/storage';
import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const USER_EXPIRATION = 3600; // 1 hour in seconds

  const token = ref<Token | null>(storage.get('token'));
  const user = ref<User | null>(storage.get('user'));
  // const router = useRouter();

  const fetchUser = async () => {
    try {
      if (!token.value || !token.value.data) {
        throw new Error('No token available');
      }
      
      const response = await api.get(API_USER_PATH, {
        headers: {
          Authorization: `Bearer ${token.value?.data}`,
        },
      });
      user.value = response.data;
      storage.set('user', user.value, {
        expiration: USER_EXPIRATION,
        version: '1.0',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(API_LOGIN_PATH, { email, password });
      token.value = response.data.token;
      if (token.value) {
        storage.set('token', token.value);
        await fetchUser();
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
    // router.push(LOGIN_PATH);
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

  return { token, user, login, register, logout, fetchUser, updateProfile, changePassword };
});
