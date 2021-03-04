/**
 * Module for the IssuesController.
 *
 * @author Maja Hedegärd
 * @version 1.0.0
 */

import fetch from 'node-fetch'

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

      const viewData = issues.map(issue => ({ // Transform to object.
        title: issue.title,
        description: issue.description,
        iid: issue.iid,
        avatar: issue.author.avatar_url,
        state: issue.closed_by
      }))

      res.render('issues/index', { viewData })
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
      const issue = {
        title: req.body.title,
        description: req.body.description,
        iid: req.body.iid,
        avatar: req.avatar,
        state: req.body.state
      }

      // Send the created issue to all subscribers.
      res.io.emit('issue', {
        title: issue.title,
        description: issue.description,
        iid: issue.iid,
        avatar: issue.avatar,
        state: issue.state
      })

      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      res.redirect('.')
    } catch (error) {
      console.log(error)
      res.redirect('..')
    }
  }
}
