/**
 * Module for the IssuesController.
 *
 * @author Maja Hedegärd
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import { Issue } from '../models/issue.js'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const getIssues = await fetch(process.env.ISSUES_URL, {
        headers: {
          Authorization: process.env.BEARER
        }
      })

      const issues = await getIssues.json()

      const viewData = {
        issues: (await Issue.find({}))
          .map(issue => ({ // Transform to object.
            id: issue._id,
            title: issue.title
          }))
      }

      console.log(issues[0].title)
      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    try {
      const viewData = {
        title: ' '
      }
      res.render('issues/new', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create new isssue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   *
   */
  async create (req, res) {
    try {
      const issue = new Issue({
        title: req.body.title
      })
      // save issue to the database.
      await issue.save()

      // Send the created issue to all subscribers.
      res.io.emit('issue', {
        title: issue.title,
        id: issue._id
      })

      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      res.redirect('.')
    } catch (error) {
      res.redirect('..')
    }
  }

  /**
   * Returns a HTML form for editing a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async edit (req, res) {
    try {
      const issue = await Issue.findOne({ _id: req.params.id })
      const viewData = {
        id: issue._id,
        title: issue.title
      }
      res.render('issues/edit', { viewData })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Updates a specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   *
   */
  async update (req, res) {
    try {
      await Issue.updateOne({ _id: req.body.id }, {
        title: req.body.title
      })
      res.redirect('..')
    } catch (error) {
      res.redirect('./edit')
    }
  }

  /**
   * Returns a HTML form for removing an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async remove (req, res) {
    try {
      const issue = await Issue.findOne({ _id: req.params.id })
      const viewData = {
        id: issue._id,
        title: issue.title
      }
      res.render('issues/remove', { viewData })
    } catch (error) {
      res.redirect('..')
    }
  }

  /**
   * Deletes a specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   *
   */
  async delete (req, res) {
    try {
      await Issue.deleteOne({ _id: req.body.id })
      res.redirect('..')
    } catch (error) {
      res.redirect('./remove')
    }
  }
}
