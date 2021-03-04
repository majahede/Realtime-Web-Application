import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issues
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)
  // Create a socket connection using Socket.io
  const socket = window.io()

  // Listen for message "new issue" from the server
  socket.on('issue', arg => {
    const id = document.querySelector(`#nr${arg.iid}`)

    const issueString = hbsTemplate(arg)
    const tr = document.createElement('tr')
    tr.innerHTML = issueString
    tr.id = `nr${arg.iid}`
    const issueList = document.querySelector('#issue-list')

    if (id) {
      issueList.replaceChild(tr, id)
    } else {
      issueList.prepend(tr)
    }
  })
}
