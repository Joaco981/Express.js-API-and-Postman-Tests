const { obtenerEstadoInstancia, StateInvitacion } = require('../service/StateInvitacion'); 
const Mesa = require('../models/Mesa'); 
const Profesor = require('../models/Profesor'); 
const { Invitacion } = require('../models/Invitacion');

describe('EstadoInvitacion Service', () => { 
  test('crear instancias de estados correctos', () => { 
    const pendienteInst = obtenerEstadoInstancia('pendiente'); 
    expect(pendienteInst.constructor.name).toBe('Pendiente');

    const aceptadaInst = obtenerEstadoInstancia('aceptada');
    expect(aceptadaInst.constructor.name).toBe('Aceptada');

    const rechazadaInst = obtenerEstadoInstancia('rechazada');
    expect(rechazadaInst.constructor.name).toBe('Rechazada');

    expect(() => obtenerEstadoInstancia('otro')).toThrow('Estado desconocido');
  });

  test('obtenerEstadoInstancia maneja diferentes estados', () => {
    const pendiente = obtenerEstadoInstancia('pendiente');
    expect(pendiente.constructor.name).toBe('Pendiente');
    
    const aceptada = obtenerEstadoInstancia('aceptada');
    expect(aceptada.constructor.name).toBe('Aceptada');
    
    const rechazada = obtenerEstadoInstancia('rechazada');
    expect(rechazada.constructor.name).toBe('Rechazada');
    expect(() => obtenerEstadoInstancia('otro')).toThrow('Estado desconocido');
  });
});

describe('Invitacion Class', () => { 
  let invitacion; 
  let mesa; 
  let titular; 
  let vocal;
  
  beforeEach(() => { 
    titular = new Profesor('Jose', 123); 
    vocal = new Profesor('Gilda', 456); 
    mesa = new Mesa('mesa1', 'Ing. de Software II', titular, vocal, new Date()); 
    invitacion = new Invitacion(mesa); 
  });
  
  test('inicializa con estado pendiente para ambos profesores', () => { 
    const estados = invitacion.getEstadosIndividuos(); 
    expect(estados[titular.nombre]).toBe('pendiente'); 
    expect(estados[vocal.nombre]).toBe('pendiente'); 
    expect(invitacion.estado).toBe('pendiente'); 
  });
  
  test('aceptar cambia estado individual y mantiene pendiente si falta otro', () => { 
    invitacion.aceptar(titular.nombre); 
    const estados = invitacion.getEstadosIndividuos(); 
    expect(estados[titular.nombre]).toBe('aceptada'); 
    expect(invitacion.estado).toBe('pendiente'); 
  });
  
  test('doble aceptar lanza error', () => { 
    invitacion.aceptar(titular.nombre); 
    expect(() => invitacion.aceptar(titular.nombre)).toThrow('Ya aceptaste esta invitación'); 
  });
  
  test('ambos aceptan lleva a estado aceptada', () => { 
    invitacion.aceptar(titular.nombre); 
    invitacion.aceptar(vocal.nombre); 
    expect(invitacion.estado).toBe('aceptada'); 
  });
  
  test('rechazar cambia estado individual y global es rechazada', () => { 
    invitacion.rechazar(vocal.nombre); 
    const estados = invitacion.getEstadosIndividuos(); 
    expect(estados[vocal.nombre]).toBe('rechazada'); 
    expect(invitacion.estado).toBe('rechazada'); 
  });
  
  test('toJSON refleja estado correcto', () => { 
    invitacion.aceptar(titular.nombre); 
    const json = invitacion.toJSON(); 
    expect(json).toHaveProperty('mesa'); 
    expect(json).toHaveProperty('estado', 'pendiente'); 
    expect(json.estados[titular.nombre]).toBe('aceptada'); 
  });

  test('intentar rechazar de nuevo en estado rechazada lanza error', () => {
    invitacion.rechazar(vocal.nombre);
    expect(invitacion.estado).toBe('rechazada'); 

    expect(() => invitacion.rechazar(vocal.nombre)).toThrow('Ya rechazaste esta invitación');
  });

});

describe('StateInvitacion Base Class', () => {
  let estadoBase;

  beforeEach(() => {
    estadoBase = new StateInvitacion();
  });

  test('método aceptar de la clase base lanza error', () => {
    expect(() => {
      estadoBase.aceptar({}, 'profesor');
    }).toThrow('Ya procesaste esta invitación');
  });

  test('método rechazar de la clase base lanza error', () => {
    expect(() => {
      estadoBase.rechazar({}, 'profesor');
    }).toThrow('Ya procesaste esta invitación');
  });
});



