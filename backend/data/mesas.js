// data/Mesas.js
import Mesa from '../models/Mesa.js';
import Profesor from '../models/Profesor.js';


const docente1 = new Profesor('Jose', '24172');
const docente2 = new Profesor('Gilda', '67890');
const docente3 = new Profesor('Figueredo', '62220');

const mesas = [
  new Mesa(1, 'Paradigmas II', docente1, docente2, '2024-07-10', ['Augusto', 'Joaco']),
  new Mesa(2, 'Ing. Software II', docente1, docente2, '2025-05-20', ['Ramiro', 'Ivan']),
  new Mesa(3, 'Paradigmas I', docente2, docente3, '2025-06-20', ['Rodrigo', 'Augusto'])
];

export { mesas };
