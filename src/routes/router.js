/**
 * The routes.
 *
 * @author Maja Hedegärd
 * @version 1.0.0
 */

import express from 'express'
import { router as issuesRouter } from './issues-router.js'

export const router = express.Router()

router.use('/issues', issuesRouter)
