/**
 * @file mockApiClient.test.ts
 * @description Unit tests for the mock API client.
 * @created 2025-05-23 12:32 ET
 * @lastUpdated 2025-05-23 12:47 ET
 * @module src/services/api
 */

import {
  login,
  logout,
  register,
  fetchUserProfile,
} from './mockApiClient';
import type { UserProfile, AuthState } from '../../types/user';
import type { ApiResponse } from '../../types/api';

// Mock the delay function to speed up tests
/* jest.mock('./mockApiClient', () => {
  const originalModule = jest.requireActual('./mockApiClient');
  return {
    __esModule: true,
    ...originalModule,
    // We keep the actual implementations of login, logout etc.,
    // but if there was an internal utility like 'delay' we wanted to mock for all tests,
    // it could be done here. For now, the delay is short and part of the async nature.
  };
}); */


describe('Mock API Client', () => {
  // Resetting mocks or state before each test if needed
  beforeEach(() => {
    // If the mockApiClient maintained internal state that needed resetting between tests,
    // we would add a reset function to it and call it here.
    // For now, we can test logout to reset state for subsequent tests where applicable.
  });

  describe('login()', () => {
    it('should return auth state on successful login', async () => {
      const credentials = { email: 'user@example.com', password: 'password' };
      const response = await login(credentials) as ApiResponse<AuthState>;
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data.isAuthenticated).toBe(true);
        expect(response.data.user?.email).toBe(credentials.email);
        expect(response.data.authToken).toBeDefined();
      }
    });

    it('should return an error on failed login', async () => {
      const credentials = { email: 'wrong@example.com', password: 'wrongpassword' };
      const response = await login(credentials);
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.errorCode).toBe('INVALID_CREDENTIALS');
      }
    });
  });

  describe('logout()', () => {
    it('should return success on logout', async () => {
      // First, ensure a user is logged in
      await login({ email: 'user@example.com', password: 'password' });
      const response = await logout();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data).toBeNull();
      }
    });

    it('fetchUserProfile should fail after logout', async () => {
      await login({ email: 'user@example.com', password: 'password' });
      await logout();
      const profileResponse = await fetchUserProfile();
      expect(profileResponse.success).toBe(false);
      if (!profileResponse.success) {
        expect(profileResponse.errorCode).toBe('UNAUTHENTICATED');
      }
    });
  });

  describe('register()', () => {
    it('should return user profile on successful registration', async () => {
      const newUserDetails = { email: 'newuser@example.com', password: 'newpassword123', fullName: 'New User Test' };
      const response = await register(newUserDetails) as ApiResponse<UserProfile>;
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data.email).toBe(newUserDetails.email);
        expect(response.data.fullName).toBe(newUserDetails.fullName);
        expect(response.data.isEmailVerified).toBe(false);
      }
      // Clean up by logging out if registration implies login, or ensure state is clean
      await logout(); 
    });

    it('should return an error if email already exists', async () => {
      const existingUserDetails = { email: 'existing@example.com', password: 'password' };
      // First registration attempt (should succeed or be a pre-existing mock user)
      await register(existingUserDetails); 
      // Second attempt with the same email
      const response = await register(existingUserDetails);
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.errorCode).toBe('EMAIL_EXISTS');
      }
      await logout(); // Clean up
    });
  });

  describe('fetchUserProfile()', () => {
    beforeEach(async () => {
      // Ensure no user is logged in before these specific tests
      await logout();
    });

    it('should return user profile if authenticated', async () => {
      await login({ email: 'user@example.com', password: 'password' });
      const response = await fetchUserProfile() as ApiResponse<UserProfile>;
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data.email).toBe('user@example.com');
      }
      await logout(); // Clean up
    });

    it('should return an error if not authenticated', async () => {
      const response = await fetchUserProfile();
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.errorCode).toBe('UNAUTHENTICATED');
      }
    });
  });
});
