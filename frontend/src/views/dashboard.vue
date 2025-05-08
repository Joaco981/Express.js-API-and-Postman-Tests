<template>
    <div class="dashboard">
      <h2>Bienvenido, {{ usuarioActual.nombre }}</h2>
      <h3>Mesas de Examen:</h3>
  
      <ul>
        <li v-for="mesa in mesasAsignadas" :key="mesa.id">
          <strong>{{ mesa.materia }}</strong> - {{ mesa.fecha }}<br />
          Tu rol: <strong>{{ obtenerRol(mesa) }}</strong><br />
          {{ obtenerRol(mesa) === 'titular' ? 'Ayudante' : 'Titular' }}:
          <em>{{ obtenerOtroNombre(mesa) }}</em><br/>
          <strong>Alumnos:</strong>

          <ul>
            <li v-for="alumno in mesa.alumnos" :key="alumno">{{ alumno }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import AuthService from '../service/SingletonAuthService';
  const authService = AuthService.getInstance();  
  export default {
    data() {
      return {
        usuarioActual: {
          nombre: "Invitado"
        },
        mesas: []
      };
    },
    mounted() {
      const nombre = authService.getUsuarioActual();
      this.usuarioActual.nombre = nombre || "Invitado";

      fetch(`http://localhost:3000/api/mesas/${nombre}`)
        .then(res => res.json())
        .then(data => {
          this.mesas = data;
        })
        .catch(err => {
          console.error('Error cargando mesas:', err);
        });
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
    }

  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 2rem;
  }
  </style>
  