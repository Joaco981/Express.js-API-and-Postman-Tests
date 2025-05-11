const Notificador = require('../models/Notificador');
const Mesa = require('../models/Mesa');
const Profesor = require('../models/Profesor');

// Creamos una estrategia falsa para verificar que se llamó
class MockStrategy {
  constructor() {
    this.llamadas = [];
  }

  notificar(receptor, materia, fecha, rol, otroProfesor, rolOtro) {
    this.llamadas.push({ receptor, materia, fecha, rol, otroProfesor, rolOtro });
  }
}

describe("Clase Notificador", () => {
  let notificador;
  let estrategiaMock;
  let profesores;
  let mesa;

  beforeEach(() => {
    const titular = new Profesor('Jose', '111');
    const vocal = new Profesor('Gilda', '222');
    profesores = { Jose: titular, Gilda: vocal };

    estrategiaMock = new MockStrategy();
    notificador = new Notificador(profesores);
    notificador.setEstrategia(estrategiaMock);

    mesa = new Mesa(1, 'Paradigmas', profesores.Jose, profesores.Gilda, '2025-07-10', ['Iván', 'Ramiro']);
  });

  test("notificar genera 2 mensajes usando la estrategia", () => {
    notificador.notificar(mesa);

    // Verifica que la estrategia se haya usado correctamente
    expect(estrategiaMock.llamadas).toHaveLength(2);

    expect(estrategiaMock.llamadas[0]).toMatchObject({
      receptor: 'Jose',
      materia: 'Paradigmas',
      fecha: '2025-07-10',
      rol: 'Titular',
      otroProfesor: 'Gilda',
      rolOtro: 'Vocal'
    });

    expect(estrategiaMock.llamadas[1]).toMatchObject({
      receptor: 'Gilda',
      rol: 'Vocal',
      otroProfesor: 'Jose',
      rolOtro: 'Titular'
    });
  });

  test("las notificaciones se guardan internamente", () => {
    notificador.notificar(mesa);
    const todas = notificador.obtenerNotificaciones();
    expect(todas).toHaveLength(2);
    expect(todas[0]).toHaveProperty('timestamp');
    expect(todas[0].receptor).toBe('Jose');
  });

  test("filtrado por usuario funciona", () => {
    notificador.notificar(mesa);
    const notisJose = notificador.obtenerNotificacionesPorUsuario('Jose');
    const notisGilda = notificador.obtenerNotificacionesPorUsuario('Gilda');

    expect(notisJose).toHaveLength(1);
    expect(notisGilda).toHaveLength(1);
    expect(notisJose[0].rol).toBe('Titular');
    expect(notisGilda[0].rol).toBe('Vocal');
  });
});
