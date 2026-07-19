const Client = require("../models/Client");

// Create Client
const createClient = async (req, res) => {
    try {

        const existingClient = await Client.findOne({
            email: req.body.email
        });

        if (existingClient) {
            return res.status(400).json({
                message: "Client already exists"
            });
        }

        const client = await Client.create(req.body);

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Clients
const getClients = async (req, res) => {
    try {

        const clients = await Client.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            count: clients.length,
            clients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Client
const getClientById = async (req, res) => {
    try {

        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            success: true,
            client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Client
const updateClient = async (req, res) => {
    try {

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            success: true,
            message: "Client updated successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Client
const deleteClient = async (req, res) => {
    try {

        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        await client.deleteOne();

        res.json({
            success: true,
            message: "Client deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};