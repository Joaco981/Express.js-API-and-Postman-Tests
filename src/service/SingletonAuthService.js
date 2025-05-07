// src/service/SingletonAuthService.js

class AuthService {
    constructor() {
      if (AuthService.instance) {
        return AuthService.instance;
      }
  
      this.usuarios = {
        "Jose": { password: "1234" },
        "Gilda": { password: "abcd" },
        "Carlos": { password: "1111" },
        "Figue": { password: "2222" }
      };
  
      AuthService.instance = this;
    }
  
    login(username, password) {
      const user = this.usuarios[username];
      if (user && user.password === password) {
        localStorage.setItem("usuario", username);
        return true;
      }
      return false;
    }
  
    getUsuarioActual() {
      return localStorage.getItem("usuario");
    }
  
    logout() {
      localStorage.removeItem("usuario");
    }
  }
  
  const authService = new AuthService();
  export default authService;
  