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

      for (let i = 0; i < issues.length; i++) {
        const issue = new Issue({
          title: issues[i].title,
          description: issues[i].description
        })
        await issue.save()
      }
      res.render('issues/index')
    } catch (error) {
      next(error)
    }
  }
}
