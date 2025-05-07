<template>
    <div class="dashboard">
      <h2>Bienvenido, {{ usuarioActual.nombre }}</h2>
      <h3>Mesas de Examen:</h3>
  
      <ul>
        <li v-for="mesa in mesasAsignadas" :key="mesa.id">
          <strong>{{ mesa.materia }}</strong> - {{ mesa.fecha }}<br />
          Tu rol: <strong>{{ obtenerRol(mesa) }}</strong><br />
          {{ obtenerRol(mesa) === 'titular' ? 'Ayudante' : 'Titular' }}:
          <em>{{ obtenerOtroNombre(mesa) }}</em>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import authService from '../service/SingletonAuthService';
  
  export default {
    data() {
      return {
        usuarioActual: {
          nombre: "Invitado" // Inicialmente por si getUsuarioActual aún no está listo
        },
        mesas: [
          {
            id: 1,
            materia: 'Ing.Software II',
            fecha: '2025-05-15',
            titular: 'Jose',
            ayudante: 'Gilda'
          },
          {
            id: 2,
            materia: 'Paradigma II',
            fecha: '2025-05-20',
            titular: 'Figue',
            ayudante: 'Jose'
          },
          {
            id: 3,
            materia: 'Redes I',
            fecha: '2025-05-22',
            titular: 'Gilda',
            ayudante: 'Carlos'
          }
        ]
      };
    },
    computed: {
      mesasAsignadas() {
        return this.mesas.filter(
          mesa =>
            mesa.titular === this.usuarioActual.nombre ||
            mesa.ayudante === this.usuarioActual.nombre
        );
      }
    },
    methods: {
      obtenerRol(mesa) {
        return mesa.titular === this.usuarioActual.nombre ? 'titular' : 'ayudante';
      },
      obtenerOtroNombre(mesa) {
        return mesa.titular === this.usuarioActual.nombre
          ? mesa.ayudante
          : mesa.titular;
      }
    },
    mounted() {
      const usuario = authService.getUsuarioActual();
      this.usuarioActual.nombre = usuario || "Invitado";
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 2rem;
  }
  </style>
  