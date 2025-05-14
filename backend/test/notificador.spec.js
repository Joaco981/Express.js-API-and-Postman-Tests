import Notificador from '../models/Notificador.js';
import Mesa from '../models/Mesa.js';
import Profesor from '../models/Profesor.js';

/**
 * Mock del Observer para pruebas
 * Simula el comportamiento de ObserverEmail y ObserverNotificacionEscritorio
 */
class MockObserver {
  constructor() {
    this.mensajes = [];
  }

  update(mensaje) {
    this.mensajes.push(mensaje);
  }
}

describe("Clase Notificador", () => {
  let notificador;
  let mockObserver;
  let profesores;
  let mesa;

  beforeEach(() => {
    // Limpia la instancia singleton antes de cada test
    Notificador._instance = null;

    const titular = new Profesor('Jose', '111');
    const vocal = new Profesor('Gilda', '222');
    profesores = { Jose: titular, Gilda: vocal };

    mockObserver = new MockObserver();
    notificador = new Notificador(profesores);
    notificador.addObserver(mockObserver);

    mesa = new Mesa(1, 'Paradigmas', profesores.Jose, profesores.Gilda, '2025-07-10', ['Iván', 'Ramiro']);
  });

  /**
   * Test: Verifica que el notificador genera y envía mensajes correctamente
   * usando el patrón Observer
   */
  test("notificar genera mensajes usando los observers", () => {
    notificador.notificar(mesa);

    // Verifica que el observer recibió los mensajes
    expect(mockObserver.mensajes).toHaveLength(2);

    expect(mockObserver.mensajes[0]).toMatchObject({
      receptor: 'Jose',
      materia: 'Paradigmas',
      fecha: '2025-07-10',
      rol: 'Titular',
      otroProfesor: 'Gilda',
      rolOtro: 'Vocal'
    });

    expect(mockObserver.mensajes[1]).toMatchObject({
      receptor: 'Gilda',
      rol: 'Vocal',
      otroProfesor: 'Jose',
      rolOtro: 'Titular'
    });
  });

  /**
   * Test: Verifica que las notificaciones se almacenan internamente
   * en el notificador
   */
  test("las notificaciones se guardan internamente", () => {
    notificador.notificar(mesa);
    const todas = notificador.obtenerNotificaciones();
    expect(todas).toHaveLength(2);
    expect(todas[0]).toHaveProperty('timestamp');
    expect(todas[0].receptor).toBe('Jose');
  });

  /**
   * Test: Verifica que el filtrado de notificaciones por usuario
   * funciona correctamente
   */
  test("filtrado por usuario funciona", () => {
    notificador.notificar(mesa);
    const notisJose = notificador.obtenerNotificacionesPorUsuario('Jose');
    const notisGilda = notificador.obtenerNotificacionesPorUsuario('Gilda');

    expect(notisJose).toHaveLength(1);
    expect(notisGilda).toHaveLength(1);
    expect(notisJose[0].rol).toBe('Titular');
    expect(notisGilda[0].rol).toBe('Vocal');
  });

  /**
   * Test: Verifica que se pueden eliminar observers correctamente
   * del sistema de notificaciones
   */
  test('debería eliminar un observer del array', () => {
    const observer1 = new MockObserver();
    const observer2 = new MockObserver();

    notificador.addObserver(observer1);
    notificador.addObserver(observer2);
    
    expect(notificador.observers.length).toBe(3); // 2 nuevos + 1 del beforeEach

    notificador.removeObserver(observer1);

    expect(notificador.observers).toContain(observer2);
    expect(notificador.observers).not.toContain(observer1);
    expect(notificador.observers.length).toBe(2);
  });

  /**
   * Test: Verifica que el patrón Singleton funciona correctamente
   * y devuelve siempre la misma instancia
   */
  test("singleton funciona correctamente", () => {
    const instancia2 = new Notificador(profesores);
    expect(instancia2).toBe(notificador);
  });

  /**
   * Test: Verifica que el registro de suscripciones push
   * se realiza correctamente usando la estrategia
   */
  test("registra suscripción push usando la estrategia", () => {
    const estrategiaFake = { registrarSuscripcion: jest.fn() };
    notificador.estrategiaPush = estrategiaFake;
    notificador.registrarSuscripcionPush('Gilda', { endpoint: 'abc' });
    expect(estrategiaFake.registrarSuscripcion).toHaveBeenCalledWith('Gilda', { endpoint: 'abc' });
  });
});

