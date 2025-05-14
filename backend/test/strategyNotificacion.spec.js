import ConsolaStrategyNotification from '../service/ConsolaStrategyNotification.js';
import StrategyNotification from '../service/StrategyNotification.js';

/**
 * Suite de pruebas para la clase base StrategyNotification
 * Verifica que la implementación del patrón Strategy es correcta
 */
describe('StrategyNotification Base Class', () => {
  let strategyBase;

  beforeEach(() => {
    strategyBase = new StrategyNotification();
  });

  /**
   * Test: Verifica que el método notificar de la clase base
   * lanza un error si no es implementado por las clases hijas
   */
  test('el método notificar de la clase base lanza un error si no es implementado', () => {
    expect(() => {
      strategyBase.notificar('Nombre Profesor', 'Materia', 'Fecha', 'Rol', 'Otro Profesor', 'Rol Otro Profesor');
    }).toThrow('El método notificar debe ser implementado por las clases hijas');
  });
});


describe('ConsolaStrategyNotification', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('debería imprimir la notificación correctamente en consola', () => {
    const strategy = new ConsolaStrategyNotification();

    const nombreProfesor = 'Jose Fernandez';
    const materia = 'Ing. de Software II';
    const fecha = '2025-05-11';
    const rol = 'Titular';
    const otroProfesor = 'Gilda Romero';
    const rolOtroProfesor = 'Vocal';

    strategy.notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor);

    const fechaEsperada = new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    expect(console.log).toHaveBeenCalledWith('\n=== NUEVA NOTIFICACIÓN ===');
    expect(console.log).toHaveBeenCalledWith(` Notificación para ${nombreProfesor}`);
    expect(console.log).toHaveBeenCalledWith(` Materia: ${materia}`);
    expect(console.log).toHaveBeenCalledWith(` Rol: ${rol}`);
    expect(console.log).toHaveBeenCalledWith(` Fecha: ${fechaEsperada}`);
    expect(console.log).toHaveBeenCalledWith(` Otro profesor: ${otroProfesor} (${rolOtroProfesor})`);
    expect(console.log).toHaveBeenCalledWith('========================\n');
  });
});


