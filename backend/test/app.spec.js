const request = require('supertest');
const app = require('../app'); // tu archivo app.js debe exportar `app`


describe('API', () => {

    //Se testea el home de la api
    test("GET / responde con mensaje de bienvenida", async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Bienvenidos al Sistema de Notificaciones UCP :D');
    });

    //Se testea el login exitoso
    test("POST /api/auth/login", async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'Jose', password: '1234' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ username: 'Jose' });
    });

    //Se testea el login fallido
    test("POST /api/auth/login", async () => {
        const res = await request(app).post('/api/auth/login').send({ username: 'Gilda', password: '1234' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Credenciales inválidas' });
    });

    //Se testea el get de mesas
    test("GET /api/mesas", async () => {
        const res = await request(app).get('/api/mesas');
    
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    
        expect(res.body[0]).toEqual({
        id: 1,
        materia: "Paradigmas II",
        titular: { nombre: "Jose", legajo: "24172" },
        vocal:   { nombre: "Gilda", legajo: "67890" },
        fecha: "2024-07-10",
        alumnos: ["Augusto", "Joaco"]
        });
    });

    //Se testea el get de mesas pero filtrado por profesor(titular o vocal)
    test("GET /api/mesas/:usuario", async () => {

        const res = await request(app).get('/api/mesas/Figueredo');
    
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    
       expect(res.body[0]).toEqual({
        id: 3,
        materia: "Paradigmas I",
        titular: { nombre: "Gilda", legajo: "67890" },
        vocal:   { nombre: "Figueredo", legajo: "62220" },
        fecha: "2025-06-20",
        alumnos: ["Rodrigo", "Augusto"]
        });
    });

    //Se testea el get profesores, osea obtener todos los profesores
    test("GET /api/profesores", async () => {
        const res = await request(app).get('/api/profesores');
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');

        expect(res.body).toEqual({
            docente1: { nombre: "Jose", legajo: "24172" },
            docente2: { nombre: "Gilda", legajo: "67890" }
        });
    });

    //Se testea el get profesor filtrado por nombre
    test("GET /api/profesores/:nombre", async () => {
        const res = await request(app).get('/api/profesores/Gilda');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ nombre: "Gilda", legajo: "67890" });
    });

    //Se testea el get de invitaciones
    test("GET /api/invitaciones", async () => {
        const res = await request(app).get('/api/invitaciones');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    
        expect(res.body[0]).toEqual({
            mesa: {
                id: 4,
                materia: "Ing en software I",
                titular: { nombre: "Gilda", legajo: "67890" },
                vocal: { nombre: "Jose", legajo: "24172" },
                fecha: "01/02/2026",
                alumnos: ["Ivan Cabrera", "Joaquin Flores"]
            },
            estado: "pendiente",
            estados: {
                "Jose": "pendiente",
                "Gilda": "pendiente"
            }
        });
    });

    //Se testea el get de invitaciones filtrado por profesor
    test("GET /api/invitaciones/:profesor", async () => {
        const res = await request(app).get('/api/invitaciones/Gilda');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    
        expect(res.body[0]).toEqual({
            mesa: {
                id: 4,
                materia: "Ing en software I",
                titular: { nombre: "Gilda", legajo: "67890" },
                vocal: { nombre: "Jose", legajo: "24172" },
                fecha: "01/02/2026",
                alumnos: ["Ivan Cabrera", "Joaquin Flores"]
            },
            estado: "pendiente",
            estados: {
                "Jose": "pendiente",
                "Gilda": "pendiente"
            }
        });
    });

});
