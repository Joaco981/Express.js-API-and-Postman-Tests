import StrategyNotification from './StrategyNotification.js';

class ConsolaStrategyNotification extends StrategyNotification {
  /* eslint-disable no-unused-vars */
  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
  /* eslint-enable no-unused-vars */
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log('\n=== NUEVA NOTIFICACIÓN ===');
    console.log(` Notificación para ${nombreProfesor}`);
    console.log(` Materia: ${materia}`);
    console.log(` Rol: ${rol}`);
    console.log(` Fecha: ${fechaFormateada}`);
    console.log(` Otro profesor: ${otroProfesor} (${rolOtroProfesor})`);
    console.log('========================\n');
  }
}

export default ConsolaStrategyNotification; 