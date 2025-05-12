<template>
  <div class="dashboard">
    <h2>Bienvenido, {{ usuarioActual.nombre }}</h2>

    <h3>Mesas de Examen:</h3>
    <div v-if="mesasAsignadas.length > 0">
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
    <div v-else>
      <p>No tienes mesas asignadas</p>
    </div>

    <h3>Invitaciones:</h3>
    <ul>
      <li v-for="inv in invitacionesPendientes" :key="inv.mesa.id">
        <strong>{{ inv.mesa.materia }}</strong> - {{ inv.mesa.fecha }}<br />
        Tu rol propuesto:
        <strong>{{ inv.mesa.titular.nombre === usuarioActual.nombre ? 'titular' : 'vocal' }}</strong><br />
        El otro rol:
        <em>{{ inv.mesa.titular.nombre === usuarioActual.nombre ? inv.mesa.vocal.nombre : inv.mesa.titular.nombre }}</em><br />

        Estado: <strong>{{ calcularEstado(inv) }}</strong><br />

        <div v-if="puedeAceptarRechazar(inv)">
          <button @click="aceptarInvitacion(inv.mesa.id)">Aceptar</button>
          <button @click="rechazarInvitacion(inv.mesa.id)">Rechazar</button>
        </div>
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
      usuarioActual: { nombre: "Invitado" },
      mesas: [],
      invitaciones: []
    };
  },

  mounted() {
    const nombre = authService.getUsuarioActual();
    this.usuarioActual.nombre = nombre || "Invitado";
    this.cargarMesasYInvitaciones();
    this.pedirPermisoNotificacion();

    // Verifica nuevas confirmaciones cada 10 segundos
    setInterval(() => {
      this.verificarNuevasConfirmaciones();
    }, 10000);
  },

  computed: {
    mesasAsignadas() {
    return this.mesas.filter(mesa => {
      const estados = mesa._estados || {};
      const usuario = this.usuarioActual.nombre.toLowerCase();
      const titular = mesa.titular?.nombre.toLowerCase();
      const vocal = mesa.vocal?.nombre.toLowerCase();

      const esTitular = titular === usuario;
      const esVocal = vocal === usuario;
      const ambosAceptaron = estados[titular] === 'aceptada' && estados[vocal] === 'aceptada';

      return (esTitular || esVocal) && ambosAceptaron;
    });
  },


    invitacionesPendientes() {
      return this.invitaciones.filter(inv => {
        const estados = Object.values(inv.estados);
        return estados.filter(e => e === 'aceptada').length < 2;
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

      // 1. Carga invitaciones pendientes
      fetch(`http://localhost:3000/api/invitaciones/${nombre}`)
        .then(res => res.json())
        .then(data => {
          this.invitaciones = data;
        });

      // 2. Carga mesas de examen (las confirmadas)
      fetch(`http://localhost:3000/api/mesas/${nombre}`)
        .then(res => res.json())
        .then(mesasExistentes => {
          console.log('Mesas recibidas del backend:', mesasExistentes); // Para depurar
          this.mesas = mesasExistentes;
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
    },

    puedeAceptarRechazar(inv) {
      return inv.estados[this.usuarioActual.nombre] === 'pendiente';
    },

    pedirPermisoNotificacion() {
      if ('Notification' in window) {
        Notification.requestPermission().then(permiso => {
          if (permiso !== 'granted') {
            console.log('Permiso de notificación denegado');
          }
        });
      }
    },

    verificarNuevasConfirmaciones() {
      const nombre = this.usuarioActual.nombre;

      fetch(`http://localhost:3000/api/invitaciones/${nombre}`)
        .then(res => res.json())
        .then(data => {
          const nuevasConfirmadas = data.filter(inv => {
            const estados = Object.values(inv.estados);
            return estados.every(e => e === 'aceptada') &&
                   !this.mesas.some(m => m.id === inv.mesa.id);
          });

          nuevasConfirmadas.forEach(inv => {
            this.notificarMesaConfirmada(inv.mesa);
          });

          if (nuevasConfirmadas.length > 0) {
            this.cargarMesasYInvitaciones();
          }
        });
    },

    notificarMesaConfirmada(mesa) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Invitación Confirmada ✅', {
          body: `La mesa de ${mesa.materia} fue confirmada para el ${mesa.fecha}.`,
          icon: '/icon-192x192.png' // Reemplazalo con tu ícono real
        });
      }
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
</style>
