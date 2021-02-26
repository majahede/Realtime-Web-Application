import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const issuesController = new IssuesController()

router.get('/', (req, res, next) => issuesController.index(req, res, next))
router.get('/new', issuesController.new)
router.post('/create', issuesController.create)

router.get('/:id/edit', issuesController.edit)
router.post('/:id/update', issuesController.update)

router.get('/:id/remove', issuesController.remove)
router.post('/:id/delete', issuesController.delete)
