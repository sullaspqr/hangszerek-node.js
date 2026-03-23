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
      title: 'Hangszerek API',
      version: '1.0.0',
      description: 'API hangszerek kezeléséhez Swagger dokumentációval',
      contact: {
        name: 'Hangszerbolt',
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
 *          description: A hangszer neve
 *          example: "American Original '50s Telecaster®"
 *        brand:
 *          type: string
 *          description: A hangszer márkája
 *          example: "Fender"
 *        price:
 *          type: number
 *          description: Ár (Ft-ban)
 *          example: 649900
 *        quantity:
 *          type: number
 *          description: Raktárkészlet
 *          example: 1
 *        imageURL:
 *          type: string
 *          description: Kép URL
 *          example: "https://www.fmicassets.com/Damroot/GuitarVertDesktopJpg/10002/0110132850_gtr_frt_001_rr.jpg"
 */

// Fix beégetett hangszer adatok
let instruments = [
  {
    id: "5fef84f891012",
    name: "American Original '50s Telecaster®",
    brand: "Fender",
    price: 649900,
    quantity: 1,
    imageURL: "https://fast-images.static-thomann.de/pics/bdb/_54/548562/18405137_800.jpg"
  },
  {
    id: "5fef84f891013",
    name: "Troublemaker Telecaster®",
    brand: "Fender",
    price: 469990,
    quantity: 3,
    imageURL: "https://www.fmicassets.com/Damroot/GuitarVertDesktopJpg/10001/5300100338_gtr_frt_001_rr.jpg"
  },
  {
    id: "5fef84f891014",
    name: "PM-2 Standard Parlor, Natural",
    brand: "Fender",
    price: 217500,
    quantity: 8,
    imageURL: "https://www.fmicassets.com/Damroot/GuitarVertDesktopJpg/10001/0970322321_gtr_frt_001_rr.jpg"
  },
  {
    id: "5fef84f891015",
    name: "Steve Vai Signature JEM77 - Blue Floral Pattern",
    brand: "Ibanez",
    price: 474775,
    quantity: 2,
    imageURL: "https://media.sweetwater.com/api/i/f-webp__q-85__ha-9a297ded42d50889__hmac-ea43dca50b7d9e5be6ad93b62b85d8379d251d3d/images/closeup/xl/1600-JEM77PBFP_front.jpg.auto.webp"
  },
  {
    id: "5fef84f891016",
    name: "J Custom RG8560 Electric Guitar - Sapphire Blue",
    brand: "Ibanez",
    price: 892800,
    quantity: 1,
    imageURL: "https://media.sweetwater.com/api/i/q-85__ha-47176ee3683d876a__hmac-649b6388a154e14c76ada1cb754c089f2a6b9c76/images/items/1800/RG8527ZSDE-xlarge.jpg"
  },
  {
    id: "5fef84f891017",
    name: "Viper-1000 - See Thru Black Cherry Satin",
    brand: "ESP LTD",
    price: 329000,
    quantity: 4,
    imageURL: "https://www.evertune.com/shop/guitars/ESP_LTD/VIPER-1000/evertune__guitars__ESP_LTD_VIPER-1000__see_thru_black_cherry_satin__v1.jpg"
  }
];

// CRUD végpontok

/**
 * @swagger
 * /instruments:
 *   get:
 *     summary: Összes hangszer lekérdezése
 *     description: Visszaadja az összes hangszert
 *     responses:
 *       200:
 *         description: Sikeres lekérdezés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instrument'
 */
app.get('/instruments', cors(), (req, res) => {
  res.json(instruments);
});

/**
 * @swagger
 * /instruments/{id}:
 *   get:
 *     summary: Egy hangszer lekérdezése ID alapján
 *     description: Visszaad egy hangszert az ID-ja alapján
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
 *               $ref: '#/components/schemas/Instrument'
 *       404:
 *         description: A hangszer nem található
 */
app.get('/instruments/:id', cors(), (req, res) => {
  const id = req.params.id;
  const instrument = instruments.find(item => item.id === id);

  if (instrument) {
    res.json(instrument);
  } else {
    res.status(404).json({ message: 'Hangszer nem található' });
  }
});

/**
 * @swagger
 * /instruments:
 *   post:
 *     summary: Új hangszer létrehozása
 *     description: Létrehoz egy új hangszert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instrument'
 *     responses:
 *       201:
 *         description: Sikeresen létrehozva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 */
let counter = 18;

app.post('/instruments', cors(), (req, res) => {

  const newInstrument = {
    id: "5fef84f8910" + counter++,
    ...req.body
  };

  instruments.push(newInstrument);
  res.status(201).json(newInstrument);
});

/**
 * @swagger
 * /instruments/{id}:
 *   put:
 *     summary: Hangszer frissítése
 *     description: Frissít egy hangszert az ID-ja alapján
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A hangszer ID-ja
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instrument'
 *     responses:
 *       200:
 *         description: Sikeres frissítés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 *       404:
 *         description: A hangszer nem található
 */
app.put('/instruments/:id', cors(), (req, res) => {
  const id = req.params.id;
  const updatedInstrument = req.body;

  const index = instruments.findIndex(item => item.id === id);

  if (index !== -1) {
    instruments[index] = { ...instruments[index], ...updatedInstrument };
    res.json(instruments[index]);
  } else {
    res.status(404).json({ message: 'Hangszer nem található' });
  }
});

/**
 * @swagger
 * /instruments/{id}:
 *   delete:
 *     summary: Hangszer törlése
 *     description: Töröl egy hangszert az ID-ja alapján
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: A hangszer ID-ja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sikeres törlés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 *       404:
 *         description: A hangszer nem található
 */
app.delete('/instruments/:id', cors(), (req, res) => {
  const id = req.params.id;
  const index = instruments.findIndex(item => item.id === id);

  if (index !== -1) {
    const deletedInstrument = instruments.splice(index, 1)[0];
    res.json(deletedInstrument);
  } else {
    res.status(404).json({ message: 'Hangszer nem található' });
  }
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT}/swagger címen`);
});
