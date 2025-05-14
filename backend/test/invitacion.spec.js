import Mesa from '../models/Mesa.js';
import Profesor from '../models/Profesor.js';
import { Invitacion } from '../models/Invitacion.js';

describe("Clase Invitacion", () => {
    let invitacion;
    let titular,vocal;

    beforeEach(() => {
        //Se crea la invitacion con sus respectivos datos (mesa y estado)
        titular = new Profesor('Figueredo', '111');
        vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1, 'Algebra', titular, vocal, '01/02/2026', ['Ivan Cabrera', 'Joaquin Flores']);


        invitacion = new Invitacion(mesa);
    });

    //Se testea que el estado inicial sea pendiente
    test("propiedades iniciales", () => {
        expect(invitacion.mesa).toBeInstanceOf(Mesa);
        expect(invitacion.estado).toBe('pendiente');
        expect(invitacion.getEstadosIndividuos()).toEqual({ 
            'Figueredo':'pendiente',
            'Gilda':'pendiente'
        });
    });
});


describe("Clase Invitacion - método aceptar", () => {
    let invitacion;
    let titular,vocal;

    beforeEach(() => {
        titular = new Profesor('Figueredo', '111');
        vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1,'Algebra',titular,vocal,'01/02/2026',['Ivan Cabrera', 'Joaquin Flores']);
        invitacion = new Invitacion(mesa);
    });

    test("aceptar cambia estado individual a 'aceptada'", () => {
        invitacion.aceptar('Figueredo');
        expect(invitacion.getEstadosIndividuos()).toEqual({ 
            'Figueredo':'aceptada',
            'Gilda':'pendiente'
        });
    });

    test("aceptar lanza error si ya se aceptó", () => {
        invitacion.aceptar('Figueredo');
        expect(() => invitacion.aceptar('Figueredo')).toThrow('Ya aceptaste esta invitación');
      });

    //Se testea _aceptar 
    test("_aceptar arroja error al aceptar una invitación ya aceptada", () => {
        invitacion._aceptar('Figueredo');
        expect(() => invitacion._aceptar('Figueredo')).toThrow('Ya procesaste esta invitación');
      });

    test("toJSON refleja estado correctamente", () => {
        invitacion.aceptar('Figueredo');
        const json = invitacion.toJSON();
        expect(json).toEqual({
            mesa: invitacion.mesa,
            estado: 'pendiente',
            estados: {
                'Figueredo': 'aceptada',
                'Gilda': 'pendiente'
            }
        });
    });
});


describe("Clase Invitacion - método rechazar", () => {
    let invitacion;
    let titular,vocal;

    beforeEach(() => {
        titular = new Profesor('Figueredo', '111');
        vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1,'Algebra',titular,vocal,'01/02/2026',['Ivan Cabrera', 'Joaquin Flores']);
        invitacion = new Invitacion(mesa);
    });

    test("rechazar cambia estado individual a 'rechazada'", () => {
        invitacion.rechazar('Gilda');
        expect(invitacion.getEstadosIndividuos()['Gilda']).toBe('rechazada');
        expect(invitacion.estado).toBe('rechazada');
    });

    test("rechazar lanza error si ya se rechazó", () => {
        invitacion.rechazar('Gilda');
        try {
          invitacion.rechazar('Gilda'); // Segunda vez, debería lanzar el error
        } catch (error) {
          console.log("Mensaje de error:", error.message);  // Verifica el mensaje
          expect(error.message).toBe('Ya rechazaste esta invitación');
        }
      });

    //Se testea _rechazar 
    test("_rechazar arroja error al rechazar una invitación ya rechazada", () => {
        invitacion._rechazar('Figueredo');
        expect(() => invitacion._rechazar('Figueredo')).toThrow('Ya procesaste esta invitación');
        });  

    test("toJSON refleja estado 'rechazada' después de un rechazo", () => {
        invitacion.rechazar('Gilda');
        const json = invitacion.toJSON();
        expect(json).toEqual({
            mesa: invitacion.mesa,
            estado: 'rechazada',
            estados: {
                'Figueredo': 'pendiente',
                'Gilda': 'rechazada'
            }
        });
    });
});

//Aca se testea que si los dos profesores (vocal y titular) aceptan la invitación, el estado general sea 'aceptada'
describe("Clase Invitacion - estado final aceptada", () => {
    let invitacion;
    let titular, vocal;

    beforeEach(() => {
        titular = new Profesor('Figueredo', '111');
        vocal   = new Profesor('Gilda', '222');
        const mesa = new Mesa(1, 'Algebra', titular, vocal, '01/02/2026', ['Ivan Cabrera', 'Joaquin Flores']);
        invitacion = new Invitacion(mesa);
    });

    test("el estado general es 'aceptada' si todos aceptaron", () => {
        invitacion.aceptar('Figueredo');
        invitacion.aceptar('Gilda');

        expect(invitacion.estado).toBe('aceptada');
        expect(invitacion.getEstadosIndividuos()).toEqual({
            'Figueredo': 'aceptada',
            'Gilda': 'aceptada'
        });
    });
});

