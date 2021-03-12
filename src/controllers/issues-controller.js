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
    const getIssues = await fetch(process.env.ISSUES_URL, {
      headers: {
        Authorization: process.env.BEARER
      }
    })
    const issues = await getIssues.json()

    if (issues.message) {
      const error = new Error('Not Found')
      error.status = 404

      next(error)
      return
    }

    const viewData = issues.map(issue => ({ // Transform to object.
      title: issue.title,
      description: issue.description,
      iid: issue.iid,
      avatar: issue.author.avatar_url,
      state: issue.closed_by
    }))

    res.render('issues/index', { viewData })
  }

  /**
   * Send new or update issue to all subscribers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   *
   */
  async viewIssue (req, res, next) {
    try {
      const getIssue = await fetch(`${process.env.ISSUES_URL}/${req.body.iid}`, {
        headers: {
          Authorization: process.env.BEARER
        }
      })
      const reqIssue = await getIssue.json()

      const issue = {
        title: req.body.title,
        description: req.body.description,
        iid: req.body.iid,
        avatar: reqIssue.author.avatar_url,
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
    } catch (error) {
      next(error)
    }
  }

  /**
   * Reopen issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   *
   */
  async reopen (req, res, next) {
    const issue = await fetch(`${process.env.ISSUES_URL}/${req.body.id}?state_event=reopen`, {
      method: 'PUT',
      headers: {
        Authorization: process.env.BEARER,
        'Content-Type': 'application/json'
      }
    })
    const body = await issue.json()

    if (body.message) {
      const error = new Error('Not Found')
      error.status = 404

      next(error)
      return
    }

    res.redirect('..')
  }

  /**
   * Close issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   *
   */
  async close (req, res, next) {
    const issue = await fetch(`${process.env.ISSUES_URL}/${req.body.id}?state_event=close`, {
      method: 'PUT',
      headers: {
        Authorization: process.env.BEARER,
        'Content-Type': 'application/json'
      }
    })
    const body = await issue.json()

    if (body.message) {
      const error = new Error('Not Found')
      error.status = 404

      next(error)
      return
    }
    res.redirect('..')
  }
}
