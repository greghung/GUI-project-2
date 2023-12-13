/*
 * Homework 6
 * model back-end JavaScript code
 *
 * Author: Craig Huang
 * Version: 2.0
 */

// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const CS3744Schema = new mongoose.Schema({
    fileName: String,
    fileContent: {
        type: Object,
        properties: {
            type: String,
            data: {
                type: Array,
                items: {
                    type: Object
                }
            }
        }
    },
});

// Export schema
module.exports = mongoose.model('CS3744Schema', CS3744Schema, 'Datasets');
