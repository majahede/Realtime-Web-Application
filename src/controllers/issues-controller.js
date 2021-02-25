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
      const getIssues = await fetch('https://gitlab.lnu.se/api/v4/projects/12924/issues', {
        headers: {
          Authorization: 'bearer jAZBEfpwGWMCgx5THg1B'
        }
      })
      const issues = await getIssues.json()
      console.log(issues[0].title)
      console.log(issues[0].description)
      res.render('issues/index')
    } catch (error) {
      next(error)
    }
  }
}
