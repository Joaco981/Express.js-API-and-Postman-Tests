// src/service/SingletonAuthService.js

class AuthService {
  static instance = null;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username, password) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      localStorage.setItem('usuario', data.username);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  getUsuarioActual() {
    return localStorage.getItem("usuario");
  }

  logout() {
    localStorage.removeItem("usuario");
  }
}

export default AuthService;
