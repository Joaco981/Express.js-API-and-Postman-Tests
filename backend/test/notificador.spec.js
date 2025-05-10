// test de models/Notificador.js

const Notificador = require('../models/Notificador');
const Profesor = require('../models/Profesor');

describe("Clase Notificador", () => {
    let notificador;
    let profesores;

    beforeEach(() => {
        profesores = [];
        profesores.push(new Profesor('Jose', '111'));
        profesores.push(new Profesor('Gilda', '222'));

        notificador = new Notificador(profesores);
    });

    test('Se crea un notificador', () => {
        expect(notificador.notificaciones.length).toBe(0);
        //expect(notificador.estrategia).toBeInstanceOf(ConsolaStrategyNotification);
        expect(notificador.profesores.length).toBe(2);
    });
});

