// src/service/SingletonAuthService.js

class AuthService {
  constructor() {
    if (AuthService._instance) {
      return AuthService._instance;
    }
    AuthService._instance = this;
    this.baseUrl = 'http://localhost:3000/api';
  }

  static getInstance() {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }
    return AuthService._instance;
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('usuario', data.username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('usuario');
  }

  isAuthenticated() {
    return !!localStorage.getItem('usuario');
  }

  getUsuarioActual() {
    return localStorage.getItem('usuario');
  }
}

export default AuthService;
