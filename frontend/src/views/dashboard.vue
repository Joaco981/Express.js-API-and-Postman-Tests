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
          <strong>Estado:</strong> {{ calcularEstadoMesa(mesa) }}<br />
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
      <li v-for="inv in invitaciones" :key="inv.mesa.id">
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
      invitaciones: [],
      notificadas: [],
      apiUrl: 'http://localhost:3000/api'
    };
  },

  mounted() {
    const nombre = authService.getUsuarioActual();
    this.usuarioActual.nombre = nombre || "Invitado";
    this.cargarMesasYInvitaciones();
    this.pedirPermisoNotificacion();

    const guardadas = localStorage.getItem('mesasNotificadas');
    this.notificadas = guardadas ? JSON.parse(guardadas) : [];

    setInterval(() => {
      this.verificarNuevasConfirmaciones();
    }, 10000);
  },

  computed: {
    mesasAsignadas() {
      const usuario = this.usuarioActual.nombre;
      return this.mesas
        .filter(mesa => mesa.titular?.nombre === usuario || mesa.vocal?.nombre === usuario)
        .map(mesa => {
          const invitacion = this.invitaciones.find(i => i.mesa.id === mesa.id);
          return invitacion ? { ...mesa, estados: invitacion.estados } : mesa;
        })
        .filter(mesa => {
          const estados = mesa.estados || {};
          return Object.values(estados).filter(e => e === 'aceptada').length === 2;
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

    calcularEstadoMesa(mesa) {
      const estados = mesa.estados || {};
      const aceptados = Object.values(estados).filter(e => e === 'aceptada').length;
      const rechazados = Object.values(estados).filter(e => e === 'rechazada').length;

      if (rechazados > 0) return "Mesa rechazada ❌";
      if (aceptados === 2) return "Aceptada ✅";
      if (aceptados === 1) return "Esperando confirmación (1/2)";
      return "Esperando confirmación (0/2)";
    },

    calcularEstado(inv) {
      const estados = Object.values(inv.estados);
      const aceptados = estados.filter(e => e === 'aceptada').length;
      const rechazados = estados.filter(e => e === 'rechazada').length;

      if (rechazados > 0) return "Mesa rechazada ❌";
      if (aceptados === 2) return "Aceptada ✅";
      if (aceptados === 1) return "Esperando confirmación (1/2)";
      return "Esperando confirmación (0/2)";
    },

    puedeAceptarRechazar(inv) {
      return inv.estados[this.usuarioActual.nombre] === 'pendiente';
    },

    aceptarInvitacion(id) {
      fetch(`${this.apiUrl}/invitaciones/aceptar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, usuario: this.usuarioActual.nombre })
      }).then(() => {
        this.cargarMesasYInvitaciones();
      });
    },

    rechazarInvitacion(id) {
      fetch(`${this.apiUrl}/invitaciones/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, usuario: this.usuarioActual.nombre })
      }).then(() => {
        this.cargarMesasYInvitaciones();
      });
    },

    async cargarMesasYInvitaciones() {
      try {
        const [invitacionesRes, mesasRes] = await Promise.all([
          fetch(`${this.apiUrl}/invitaciones/${this.usuarioActual.nombre}`),
          fetch(`${this.apiUrl}/mesas/${this.usuarioActual.nombre}`)
        ]);

        if (!invitacionesRes.ok || !mesasRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const invitaciones = await invitacionesRes.json();
        const mesasConfirmadas = await mesasRes.json();

        this.invitaciones = invitaciones;
        this.mesas = mesasConfirmadas;
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Error al cargar las mesas e invitaciones';
      }
    },

    async pedirPermisoNotificacion() {
      if ('Notification' in window) {
        try {
          const permiso = await Notification.requestPermission();
          if (permiso === 'granted') {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
              scope: '/'
            });
            console.log('Service Worker registrado:', registration);

            const response = await fetch(`${this.apiUrl}/notificaciones/registrar`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                usuario: this.usuarioActual.nombre,
                subscription: true
              })
            });

            if (!response.ok) throw new Error('Error al registrar la suscripción');

            console.log('Suscripción push registrada exitosamente');
          }
        } catch (error) {
          console.error('Error al configurar notificaciones push:', error);
        }
      }
    },

    verificarNuevasConfirmaciones() {
      const nombre = this.usuarioActual.nombre;
      fetch(`${this.apiUrl}/invitaciones/${nombre}`)
        .then(res => res.json())
        .then(data => {
          const nuevasConfirmadas = data.filter(inv => {
            const estados = Object.values(inv.estados);
            return estados.every(e => e === 'aceptada') &&
              !this.notificadas.includes(inv.mesa.id);
          });

          nuevasConfirmadas.forEach(inv => {
            this.notificarMesaConfirmada(inv.mesa);
            this.notificadas.push(inv.mesa.id);
            localStorage.setItem('mesasNotificadas', JSON.stringify(this.notificadas));
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
          icon: '/icon-192x192.png'
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