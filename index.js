// index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');

app.use(bodyParser.json());

// Função 1: Retornar data e hora atual
app.get('/current-time', (req, res) => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    res.json({ currentTime });
});

// Função 2: Definir parâmetros do alimentador e obter status
const feederData = {
    temperature: 25, // temperatura ambiente
    animalApproaches: 0, // quantidade de vezes da aproximação do animal
    alarmTimes: ["06:00", "18:00"], // horários dos alarmes
};

app.get('/feeder-status', (req, res) => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    res.json({
        temperature: feederData.temperature,
        animalApproaches: feederData.animalApproaches,
        alarmTimes: feederData.alarmTimes,
        currentFeederTime: currentTime,
    });
});

app.post('/set-alarm-times', (req, res) => {
    const { alarmTimes } = req.body;
    if (alarmTimes && Array.isArray(alarmTimes) && alarmTimes.length === 2) {
        feederData.alarmTimes = alarmTimes;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid alarm times' });
    }
});

app.post('/feed-manual', (req, res) => {
    feederData.animalApproaches += 1;
    res.json({ message: 'Feeding triggered manually', newApproaches: feederData.animalApproaches });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const db = require('./database');

// Registra informação sobre alimentar manual
app.post('/feed-manual', (req, res) => {
    feederData.animalApproaches += 1;
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    db.run(
        'INSERT INTO feeding_log (timestamp, event_type) VALUES (?, ?)', [currentTime, 'manual'],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log event' });
            }
            res.json({ message: 'Feeding triggered manually', newApproaches: feederData.animalApproaches });
        }
    );
});