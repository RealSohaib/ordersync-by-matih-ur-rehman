const { FinanceModle } = require("../1-Modle/modle.js");

// Display all finances
const DisplayFinances = async (req, res) => {
    try {
        const finances = await FinanceModle.find();
        res.status(200).json(finances);
        console.log("Data saved");
    } catch (err) {
        console.error('Error displaying finances:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add a new finance entry
const AddFinance = async (req, res) => {
    const { type, amount, purpose, revenue } = req.body;

    try {
        const newFinance = new FinanceModle({
            type,
            amount,
            purpose,
            revenue
        });

        const savedFinance = await newFinance.save();
        res.status(201).json(savedFinance);
    } catch (err) {
        console.error('Error adding finance:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Edit an existing finance entry
const EditFinance = async (req, res) => {
    const { _id, type, amount,  purpose, revenue } = req.body;

    try {
        const updatedFinance = await FinanceModle.findOneAndUpdate(
            { _id },
            { type, amount, purpose, revenue },
            { new: true }
        );

        if (updatedFinance) {
            res.status(200).json(updatedFinance);
        } else {
            res.status(404).json({ message: 'Finance entry not found' });
        }
    } catch (err) {
        console.error('Error editing finance:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const EditName= async (req, res) => {
    const { _id,   purpose,} = req.body;

    try {
        const updatedFinance = await FinanceModle.findOneAndUpdate(
            { _id },
            { purpose},
            { new: true }
        );

        if (updatedFinance) {
            res.status(200).json(updatedFinance);
        } else {
            res.status(404).json({ message: 'Finance entry not found' });
        }
    } catch (err) {
        console.error('Error editing finance:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a finance entry
const DeleteFinance = async (req, res) => {
    const { _id } = req.body;

    try {
        const deletedFinance = await FinanceModle.findOneAndDelete({ _id });

        if (deletedFinance) {
            res.status(200).json(deletedFinance);
        } else {
            res.status(404).json({ message: 'Finance entry not found' });
        }
    } catch (err) {
        console.error('Error deleting finance:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    DisplayFinances,
    AddFinance,
    EditName,
    EditFinance,
    DeleteFinance
};