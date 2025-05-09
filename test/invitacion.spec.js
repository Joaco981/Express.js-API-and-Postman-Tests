const Mesa = require('../backend/models/Mesa');
const Profesor = require('../backend/models/Profesor');
const Invitacion = require('../backend/models/Invitacion');

describe("Clase Invitacion", () => {
    let invitacion;

    beforeEach(() => {
        //Se crea la invitacion con sus respectivos datos (mesa y estado)
        const titular = new Profesor('Figueredo');
        const vocal   = new Profesor('Gilda');
        const mesa = new Mesa(1, 'Algebra', titular, vocal, '01/02/2026', ['Ivan Cabrera', 'Joaquin Flores']);

        invitacion = new Invitacion(mesa);
    });

    //Se testea que el estado inicial sea pendiente
    test("propiedades iniciales", () => {
        expect(invitacion.mesa).toBeInstanceOf(Mesa);
        expect(invitacion.estado).toBe('pendiente');
    });

    /*test("aceptar", () => {
        invitacion.aceptar();
        expect(invitacion.estado).toBe('aceptado');
    });

    test("rechazar", () => {
        invitacion.rechazar();
        expect(invitacion.estado).toBe('rechazado');
    });*/
});




