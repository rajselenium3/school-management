import apiClient from '../config/api.js';

class AuthService {
  // Login with email and password
  async login(credentials) {
    try {
      // Try backend first
      const response = await apiClient.post('/auth/login', credentials);
      const { token, email, firstName, lastName, roles } = response.data;

      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', roles[0]);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ email, firstName, lastName, roles })
      );

      return { token, email, firstName, lastName, roles };
    } catch (error) {
      // Fallback to demo mode if backend is not available or not properly configured
      if (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.response?.status === 403 ||
        error.response?.status === 401 ||
        error.response?.status === 404
      ) {
        console.log(
          '🚀 Backend unavailable or not configured, using demo mode'
        );
        return this.demoLogin(credentials);
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Direct demo login (bypasses backend entirely)
  directDemoLogin(role) {
    const demoUsers = {
      admin: {
        email: 'admin@school.edu',
        firstName: 'John',
        lastName: 'Admin',
        roles: ['ADMIN'],
        studentId: null,
        teacherId: null,
      },
      teacher: {
        email: 'sarah.johnson@school.edu',
        firstName: 'Sarah',
        lastName: 'Johnson',
        roles: ['TEACHER'],
        studentId: null,
        teacherId: 'TCH001',
      },
      student: {
        email: 'emma.thompson@school.edu',
        firstName: 'Emma',
        lastName: 'Thompson',
        roles: ['STUDENT'],
        studentId: 'STU001',
        teacherId: null,
      },
      parent: {
        email: 'mike.parent@school.edu',
        firstName: 'Mike',
        lastName: 'Parent',
        roles: ['PARENT'],
        studentId: null,
        teacherId: null,
      },
    };

    const user = demoUsers[role];
    if (!user) {
      throw new Error('Invalid demo role');
    }

    // Generate demo JWT token with specific demo prefix
    const token = `demo-jwt-${role}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store demo auth info
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.roles[0]);
    localStorage.setItem('userInfo', JSON.stringify(user));
    localStorage.setItem('demoMode', 'true'); // Explicit demo mode flag

    console.log(
      '🎭 Direct demo mode activated for:',
      role,
      'with token:',
      token.substring(0, 30) + '...'
    );

    return {
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      studentId: user.studentId,
      teacherId: user.teacherId,
    };
  }

  // Demo login for development (legacy - used by backend fallback)
  demoLogin(credentials) {
    // Mock demo users
    const demoUsers = {
      'admin@school.edu': {
        email: 'admin@school.edu',
        firstName: 'John',
        lastName: 'Admin',
        roles: ['ADMIN'],
        password: 'admin123',
      },
      'sarah.johnson@school.edu': {
        email: 'sarah.johnson@school.edu',
        firstName: 'Sarah',
        lastName: 'Johnson',
        roles: ['TEACHER'],
        password: 'teacher123',
      },
      'emma.thompson@school.edu': {
        email: 'emma.thompson@school.edu',
        firstName: 'Emma',
        lastName: 'Thompson',
        roles: ['STUDENT'],
        password: 'student123',
      },
      'mike.parent@school.edu': {
        email: 'mike.parent@school.edu',
        firstName: 'Mike',
        lastName: 'Parent',
        roles: ['PARENT'],
        password: 'parent123',
      },
    };

    const user = demoUsers[credentials.email];
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid demo credentials');
    }

    // Generate mock JWT token
    const token = `demo-jwt-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store demo auth info
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.roles[0]);
    localStorage.setItem('userInfo', JSON.stringify(user));

    console.log(
      '🚀 Demo mode: Backend not available, using mock authentication'
    );

    return {
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Demo mode registration
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating user registration');

        // Simulate successful registration
        return {
          success: true,
          message: 'Registration successful! (Demo Mode)',
          user: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
          },
        };
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Google OAuth login
  async googleLogin() {
    try {
      // In a real implementation, this would use Google OAuth SDK
      const response = await apiClient.post('/auth/google');
      return response.data;
    } catch (error) {
      // Demo mode Google login
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating Google OAuth login');

        // Simulate Google user data
        const mockGoogleUser = {
          email: 'googleuser@gmail.com',
          firstName: 'Google',
          lastName: 'User',
          displayName: 'Google User',
          roles: ['STUDENT'],
          token: `demo-google-jwt-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          requiresEmailVerification: true,
        };

        return mockGoogleUser;
      }
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  // Send login verification code
  async sendLoginVerificationCode(email) {
    try {
      const response = await apiClient.post('/auth/send-login-code', { email });
      return response.data;
    } catch (error) {
      // Demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating login verification code send');
        return {
          success: true,
          message: 'Verification code sent (Demo: use 123456)',
        };
      }
      throw new Error(
        error.response?.data?.message || 'Failed to send verification code'
      );
    }
  }

  // Verify login code
  async verifyLoginCode(email, code) {
    try {
      const response = await apiClient.post('/auth/verify-login-code', {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      // Demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating login code verification');

        // Accept demo code
        if (code === '123456') {
          return { success: true, message: 'Code verified successfully' };
        } else {
          throw new Error('Invalid verification code (Demo: use 123456)');
        }
      }
      throw new Error(
        error.response?.data?.message || 'Code verification failed'
      );
    }
  }

  // Resend login verification code
  async resendLoginVerificationCode(email) {
    try {
      const response = await apiClient.post('/auth/resend-login-code', {
        email,
      });
      return response.data;
    } catch (error) {
      // Demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating resend login verification code');
        return {
          success: true,
          message: 'New verification code sent (Demo: use 123456)',
        };
      }
      throw new Error(
        error.response?.data?.message || 'Failed to resend verification code'
      );
    }
  }

  // Request password reset
  // async requestPasswordReset(email) {
  //   try {
  //     const response = await apiClient.post('/auth/forgot-password', { email });
  //     return response.data;
  //   } catch (error) {
  //     // Demo mode
  //     if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
  //       console.log('🎭 Demo mode: Simulating password reset request');
  //       return {
  //         success: true,
  //         message: 'Password reset code sent to your email (Demo: use 123456)',
  //       };
  //     }
  //     throw new Error(
  //       error.response?.data?.message || 'Password reset request failed'
  //     );
  //   }
  // }

  // Verify reset code
  async verifyResetCode(email, code) {
    try {
      const response = await apiClient.post('/auth/verify-reset-code', {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      // Demo mode
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('🎭 Demo mode: Simulating reset code verification');

        if (code === '123456') {
          return {
            success: true,
            resetToken: `demo-reset-token-${Date.now()}`,
            message: 'Reset code verified successfully',
          };
        } else {
          throw new Error('Invalid reset code (Demo: use 123456)');
        }
      }
      throw new Error(
        error.response?.data?.message || 'Reset code verification failed'
      );
    }
  }

  // Reset password with token
  // async resetPassword(resetData) {
  //   try {
  //     const response = await apiClient.post('/auth/reset-password', resetData)
  //     return response.data
  //   } catch (error) {
  //     // Demo mode
  //     if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
  //       console.log('🎭 Demo mode: Simulating password reset')
  //       return {
  //         success: true,
  //         message: 'Password reset successfully (Demo Mode)'
  //       }
  //     }
  //     throw new Error(error.response?.data?.message || 'Password reset failed')
  //   }
  // }

  // Logout
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('demoMode');
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // Validate token
  async validateToken() {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    } catch (error) {
      throw new Error('Token validation failed');
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user info');
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put(
        '/auth/change-password',
        passwordData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Password change failed'
      );
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Password reset request failed'
      );
    }
  }

  // Reset password with token
  async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get stored user role
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Get stored user info
  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
