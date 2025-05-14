// data/Profesores.js
import Profesor from '../models/Profesor.js';

const docente1 = new Profesor('Jose', '24172');
const docente2 = new Profesor('Gilda', '67890');

const profesores = {
  docente1: docente1,
  docente2: docente2
};

export default profesores;
