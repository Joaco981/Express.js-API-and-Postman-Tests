<template>
  <div class="dashboard">
    <h2>Bienvenido, {{ usuarioActual.nombre }}</h2>

    <div v-if="mesasAsignadas.length > 0">
      <h3>Mesas de Examen:</h3>
      <ul>
        <li v-for="mesa in mesasAsignadas" :key="mesa.id">
          <strong>{{ mesa.materia }}</strong> - {{ mesa.fecha }}<br />
          Tu rol: <strong>{{ obtenerRol(mesa) }}</strong><br />
          {{ obtenerRol(mesa) === 'titular' ? 'Vocal' : 'Titular' }}:
          <em>{{ obtenerOtroNombre(mesa) }}</em><br />
          <strong>Alumnos:</strong>
          <ul>
            <li v-for="alumno in mesa.alumnos" :key="alumno">{{ alumno }}</li>
          </ul>
        </li>
      </ul>
    </div>

    <h3>Invitaciones:</h3>
    <ul>
      <li v-for="inv in invitaciones" :key="inv.mesa.id">
        <strong>{{ inv.mesa.materia }}</strong> - {{ inv.mesa.fecha }}<br />
        Tu rol propuesto:
        <strong>{{ inv.mesa.titular.nombre === usuarioActual.nombre ? 'titular' : 'vocal' }}</strong><br />
        El otro rol:
        <em>{{ inv.mesa.titular.nombre === usuarioActual.nombre ? inv.mesa.vocal.nombre : inv.mesa.titular.nombre }}</em><br />
        
        Estado: <strong>{{ calcularEstado(inv) }}</strong><br />

        <button 
          @click="aceptarInvitacion(inv.mesa.id)" 
          :disabled="inv.estados[usuarioActual.nombre] !== 'pendiente'"
        >Aceptar</button>

        <button 
          @click="rechazarInvitacion(inv.mesa.id)" 
          :disabled="inv.estados[usuarioActual.nombre] !== 'pendiente'"
        >Rechazar</button>
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
      mesas: [],
      invitaciones: []
    };
  },

  mounted() {
    const nombre = authService.getUsuarioActual();
    this.usuarioActual.nombre = nombre || "Invitado";
    this.cargarMesasYInvitaciones();
  },

  computed: {
    mesasAsignadas() {
    return this.mesas.filter(mesa => {
      const estados = mesa.estados || {};
      return (
        (mesa.titular?.nombre === this.usuarioActual.nombre ||
          mesa.vocal?.nombre === this.usuarioActual.nombre) &&
        estados[mesa.titular?.nombre] === 'aceptada' &&
        estados[mesa.vocal?.nombre] === 'aceptada'
      );
    });
  }

  },

  methods: {
    obtenerRol(mesa) {
      return mesa.titular?.nombre === this.usuarioActual.nombre ? 'titular' : 'vocal';
    },

    obtenerOtroNombre(mesa) {
      return mesa.titular?.nombre === this.usuarioActual.nombre
        ? mesa.vocal?.nombre
        : mesa.titular?.nombre;
    },

    aceptarInvitacion(id) {
      fetch('http://localhost:3000/api/invitaciones/aceptar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, usuario: this.usuarioActual.nombre })
      }).then(() => {
        this.cargarMesasYInvitaciones();
      });
    },

    rechazarInvitacion(id) {
      fetch('http://localhost:3000/api/invitaciones/rechazar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, usuario: this.usuarioActual.nombre })
      }).then(() => {
        this.cargarMesasYInvitaciones();
      });
    },

    cargarMesasYInvitaciones() {
      const nombre = this.usuarioActual.nombre;

      // Cargar mesas
      fetch(`http://localhost:3000/api/mesas/${nombre}`)
        .then(res => res.json())
        .then(data => {
          this.mesas = data;
        });

      // Cargar invitaciones (sin filtrar, así ves también progreso)
      fetch(`http://localhost:3000/api/invitaciones/${nombre}`)
        .then(res => res.json())
        .then(data => {
          this.invitaciones = data;
        });
    },

    calcularEstado(inv) {
      const miEstado = inv.estados[this.usuarioActual.nombre];
      const estados = Object.values(inv.estados);
      const aceptados = estados.filter(e => e === 'aceptada').length;
      const rechazados = estados.filter(e => e === 'rechazada').length;

      if (miEstado === 'rechazada') return "Rechazaste la invitación ❌";

      if (rechazados > 0 && miEstado === 'aceptada') {
        return "Aceptaste, pero el otro rechazó. Esperando nuevo profesor...";
      }

      if (aceptados === 2) return "Aceptada ✅";

      return `Esperando confirmación (${aceptados}/2)`;
    }



  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
</style>
