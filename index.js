const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, models } = require('./models');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes
app.post('/persons', [
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('email').isEmail(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!check('email').isEmail()) {
        return res.status(400).json({ errors: 'Invalid Email' });
    }
    try {
        const person = await models.Person.create(req.body);
        res.json(person);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/persons', async (req, res) => {
    const { page = 1, limit = 10, searchId, searchFirstName, searchLastName, searchEmail } = req.query;
    const offset = (page - 1) * limit;
    let whereClause = {};

    // Construct the where clause based on provided search parameters
    if (searchFirstName !== undefined) {
        whereClause.firstName = { [Op.like]: `%${searchFirstName}%` };
    }
    if (searchLastName !== undefined) {
        whereClause.lastName = { [Op.like]: `%${searchLastName}%` };
    }
    if (searchEmail !== undefined) {
        whereClause.email = { [Op.like]: `%${searchEmail}%` };
    }

    try {
        const { count, rows } = await models.Person.findAndCountAll({
            where: whereClause,
            offset,
            limit: parseInt(limit),
        });
        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            persons: rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const person = await models.Person.findByPk(id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/persons/edit/:id', async (req, res) => {
    const { id } = req.params;
    const existingPerson = await models.Person.findByPk(id);

    if (!existingPerson) {
        return res.status(404).json({ error: 'Person not found' });
    }

    try {
        const [updated] = await models.Person.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedPerson = await models.Person.findByPk(id);
            res.json(updatedPerson);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.delete('/persons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await models.Person.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.json({ message: 'Person deleted' });
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Server start
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
