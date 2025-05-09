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
});


describe("Clase Invitacion - método aceptar", () => {
    let invitacion;

    beforeEach(() => {
        const titular = new Profesor('Figueredo', '111');
        const vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1,'Algebra',titular,vocal,'01/02/2026',['Ivan Cabrera', 'Joaquin Flores']);
        invitacion = new Invitacion(mesa);
    });

    test("aceptar cambia estado a 'aceptada'", () => {
        invitacion.aceptar();
        expect(invitacion.estado).toBe('aceptada');
    });

    test("aceptar lanza error si no está en pendiente", () => {
        invitacion.aceptar();
        expect(() => invitacion.aceptar()).toThrow('Solo se puede aceptar una invitación pendiente');
    });

    test("toJSON refleja estado 'aceptada' después de aceptar", () => {
        invitacion.aceptar();
        const json = invitacion.toJSON();
        expect(json).toEqual({
            mesa: invitacion.mesa,
            estado: 'aceptada'
        });
    });
});

describe("Clase Invitacion - método rechazar", () => {
    let invitacion;

    beforeEach(() => {
        const titular = new Profesor('Figueredo', '111');
        const vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1,'Algebra',titular,vocal,'01/02/2026',['Ivan Cabrera', 'Joaquin Flores']);
        invitacion = new Invitacion(mesa);
    });

    test("rechazar cambia estado a 'rechazada'", () => {
        invitacion.rechazar();
        expect(invitacion.estado).toBe('rechazada');
    });

    test("rechazar lanza error si no está en pendiente", () => {
        invitacion.rechazar();
        expect(() => invitacion.rechazar()).toThrow('Solo se puede rechazar una invitación pendiente');
    });

    test("toJSON refleja estado 'rechazada' después de rechazar", () => {
        invitacion.rechazar();
        const json = invitacion.toJSON();
        expect(json).toEqual({
            mesa: invitacion.mesa,
            estado: 'rechazada'
        });
    });
});
