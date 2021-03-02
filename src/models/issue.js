/**
 * Mongoose model Issue.
 *
 * @author Maja Hedegärd
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}, {
  timestamps: true
})

// Create a model using the schema.
export const Issue = mongoose.model('Issue', schema)
