<template>
    <div class="login">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">Usuario:</label>
          <input v-model="username" type="text" id="username" />
        </div>
  
        <div>
          <label for="password">Contraseña:</label>
          <input v-model="password" type="password" id="password" />
        </div>
  
        <button type="submit">Ingresar</button>
  
        <p v-if="error" style="color: red">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
import AuthService from '../service/SingletonAuthService';
const authService = AuthService.getInstance();  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async login() {
        const exito = await authService.login(this.username, this.password);
        if (exito) {
          this.$router.push('/dashboard');
        } else {
          this.error = "Usuario o contraseña incorrectos";
        }
      }

    }
  };
  </script>
  