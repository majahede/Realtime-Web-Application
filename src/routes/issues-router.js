import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const issuesController = new IssuesController()

router.get('/', (req, res, next) => issuesController.index(req, res, next))

router.post('/create', issuesController.create)
router.post('/:id/reopen', issuesController.reopen)
router.post('/:id/close', issuesController.close)
