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
      return this.mesas.filter(mesa => {
        const usuario = this.usuarioActual.nombre.toLowerCase();
        const titular = mesa.titular?.nombre.toLowerCase();
        const vocal = mesa.vocal?.nombre.toLowerCase();

        const esTitular = titular === usuario;
        const esVocal = vocal === usuario;

        // Si la mesa tiene estados, verificar que ambos aceptaron
        if (mesa.estados) {
          const ambosAceptaron = mesa.estados[titular] === 'aceptada' && mesa.estados[vocal] === 'aceptada';
          return (esTitular || esVocal) && ambosAceptaron;
        }

        // Si no tiene estados, es una mesa confirmada directamente
        return esTitular || esVocal;
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

        // Actualizar las invitaciones
        this.invitaciones = invitaciones;

        // Actualizar las mesas - solo las confirmadas
        this.mesas = mesasConfirmadas;
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Error al cargar las mesas e invitaciones';
      }
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

    async pedirPermisoNotificacion() {
      if ('Notification' in window) {
        try {
          const permiso = await Notification.requestPermission();
          if (permiso === 'granted') {
            // Registrar el service worker
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
              scope: '/'
            });
            console.log('Service Worker registrado:', registration);

            // Registrar la suscripción en el backend
            const response = await fetch('http://localhost:3000/api/notificaciones/registrar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                usuario: this.usuarioActual.nombre,
                subscription: true // Indicamos que el usuario está suscrito
              })
            });

            if (!response.ok) {
              throw new Error('Error al registrar la suscripción');
            }

            console.log('Suscripción push registrada exitosamente');
          } else {
            console.log('Permiso de notificación denegado');
          }
        } catch (error) {
          console.error('Error al configurar notificaciones push:', error);
        }
      } else {
        console.log('Este navegador no soporta notificaciones push');
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
