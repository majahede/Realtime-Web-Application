/**
 * Module for the IssuesController.
 *
 * @author Maja Hedegärd
 * @version 1.0.0
 */

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
      res.render('issues/index')
    } catch (error) {
      next(error)
    }
  }
}
