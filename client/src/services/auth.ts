// Authentication service to replace Supabase auth
export class AuthService {
  private baseUrl = '/api';
  private tokenKey = 'auth_token';

  async signUp(email: string, password: string, fullName?: string) {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed');
    }

    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }

    return { data: { user: data.user }, error: null };
  }

  async signIn(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed');
    }

    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }

    return { data: { user: data.user }, error: null };
  }

  async signOut() {
    const token = localStorage.getItem(this.tokenKey);
    
    if (token) {
      await fetch(`${this.baseUrl}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem(this.tokenKey);
    return { error: null };
  }

  async getSession() {
    const token = localStorage.getItem(this.tokenKey);
    
    if (!token) {
      return { data: { session: null }, error: null };
    }

    try {
      // Decode JWT token to check if it's still valid
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired
        localStorage.removeItem(this.tokenKey);
        return { data: { session: null }, error: null };
      }

      return { 
        data: { 
          session: { 
            user: { 
              id: payload.userId, 
              email: payload.email 
            } 
          } 
        }, 
        error: null 
      };
    } catch {
      // Invalid token
      localStorage.removeItem(this.tokenKey);
      return { data: { session: null }, error: null };
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simple implementation - in a real app you might want to use WebSockets or polling
    const checkAuth = async () => {
      const { data } = await this.getSession();
      callback('SIGNED_IN', data.session);
    };

    checkAuth();

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            // No-op for this simple implementation
          }
        }
      }
    };
  }

  getAuthHeader() {
    const token = localStorage.getItem(this.tokenKey);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();