const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001;

// Swagger konfiguráció
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dobok API',
      version: '1.0.0',
      description: 'API dobok kezeléséhez Swagger dokumentációval',
      contact: {
        name: 'Dobfelszerelés bolt',
        url: 'http://localhost:3001'
      }
    },
    servers: [
      {
        url: `http://localhost:3001`,
        description: 'Development server',
      },
    ],
  },
  apis: ['server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static("public"));
// Middleware-ek
app.use(bodyParser.json());
app.use(cors());

/**
 * @swagger
 * components:
 *  schemas:
 *    Instrument:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Egyedi azonosító
 *          example: "5fef84f891012"
 *        name:
 *          type: string
 *          description: A dob neve
 *          example: "Pearl Export EXX®"
 *        brand:
 *          type: string
 *          description: A dob márkája
 *          example: "Pearl"
 *        price:
 *          type: number
 *          description: Ár (Ft-ban)
 *          example: 649900
 *        quantity:
 *          type: number
 *          description: Raktárkészlet
 *          example: 1
 */

// Fix beégetett dob adatok
let drums = [
 {
  id: "5fef84f891012",
  name: "Mapex Saturn V MH Exotic",
  brand: "Mapex",
  price: 899000,
  quantity: 1
},
{
   id: "5fef84f891013",
  name: "Pearl Masters Maple Complete",
  brand: "Pearl",
  price: 749000,
  quantity: 1
},
{
  id: "5fef84f891014",
  name: "Yamaha Stage Custom Birch",
  brand: "Yamaha",
  price: 389000,
  quantity: 1
},
{
  id: "5fef84f891015",
  name: "Tama Starclassic Maple",
  brand: "Tama",
  price: 820000,
  quantity: 1
},
{
  id: "5fef84f891016",
  name: "Ludwig Classic Maple",
  brand: "Ludwig",
  price: 930000,
  quantity: 1
},
{
  id: "5fef84f891017",
  name: "DW Collector’s Series Maple",
  brand: "DW",
  price: 1150000,
  quantity: 1
},
{
  id: "5fef84f891018,
  name: "Sonor SQ1 Birch",
  brand: "Sonor",
  price: 690000,
  quantity: 1
},
{
  id: "5fef84f891019,
  name: "Gretsch Renown Maple",
  brand: "Gretsch",
  price: 560000,
  quantity: 1
},
{
  id: "5fef84f891020
  name: "Pearl Export EXX",
  brand: "Pearl",
  price: 289000,
  quantity: 1
},
{
  id: "5fef84f891021
  name: "Tama Imperialstar",
  brand: "Tama",
  price: 245000,
  quantity: 1
}
];

// CRUD végpontok

/**
 * @swagger
 * /drums:
 *   get:
 *     summary: Összes dob lekérdezése
 *     description: Visszaadja az összes dobot
 *     responses:
 *       200:
 *         description: Sikeres lekérdezés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Drum'
 */
app.get('/drums', cors(), (req, res) => {
  res.json(instruments);
});

/**
 * @swagger
 * /drums/{id}:
 *   get:
 *     summary: Egy dob lekérdezése ID alapján
 *     description: Visszaad egy dobot az ID-ja alapján
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A hangszer ID-ja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sikeres lekérdezés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drum'
 *       404:
 *         description: A hangszer nem található
 */
app.get('/drums/:id', cors(), (req, res) => {
  const id = req.params.id;
  const drum = drums.find(item => item.id === id);

  if (drum) {
    res.json(drum);
  } else {
    res.status(404).json({ message: 'Dob nem található' });
  }
});

/**
 * @swagger
 * /drums:
 *   post:
 *     summary: Új dob létrehozása
 *     description: Létrehoz egy új dobot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Drum'
 *     responses:
 *       201:
 *         description: Sikeresen létrehozva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drum'
 */
let counter = 22;

app.post('/drums', cors(), (req, res) => {

  const newDrum = {
    id: "5fef84f8910" + counter++,
    ...req.body
  };

  drums.push(newDrum);
  res.status(201).json(newDrum);
});

/**
 * @swagger
 * /drums/{id}:
 *   put:
 *     summary: Dob frissítése
 *     description: Frissít egy dobot az ID-ja alapján
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A dob ID-ja
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Drum'
 *     responses:
 *       200:
 *         description: Sikeres frissítés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drum'
 *       404:
 *         description: A dob nem található
 */
app.put('/drums/:id', cors(), (req, res) => {
  const id = req.params.id;
  const updatedDrum = req.body;

  const index = drums.findIndex(item => item.id === id);

  if (index !== -1) {
    drums[index] = { ...drums[index], ...updatedDrum };
    res.json(drums[index]);
  } else {
    res.status(404).json({ message: 'Dob nem található' });
  }
});

/**
 * @swagger
 * /drums/{id}:
 *   delete:
 *     summary: Dob törlése
 *     description: Töröl egy dobot az ID-ja alapján
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A dob ID-ja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sikeres törlés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drum'
 *       404:
 *         description: A dob nem található
 */
app.delete('/drums/:id', cors(), (req, res) => {
  const id = req.params.id;
  const index = drums.findIndex(item => item.id === id);

  if (index !== -1) {
    const deletedDrum = drums.splice(index, 1)[0];
    res.json(deletedDrum);
  } else {
    res.status(404).json({ message: 'Dob nem található' });
  }
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT}/swagger címen`);
});
