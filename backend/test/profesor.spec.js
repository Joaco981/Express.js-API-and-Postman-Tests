import Profesor from '../models/Profesor.js';

describe("Clase Profesor", () => {
    test("Crear profesor con nombre y legajo", () => {
        const profesor = new Profesor("Jose Fernandez", "24172");
        expect(profesor.nombre).toBe("Jose Fernandez");
        expect(profesor.legajo).toBe("24172");
    });

    test("toJSON devuelve objeto con nombre y legajo", () => {
        const profesor = new Profesor("Gilda Romero", "67890");
        const json = profesor.toJSON();
        expect(json).toEqual({
            nombre: "Gilda Romero",
            legajo: "67890"
        });
    });
});
