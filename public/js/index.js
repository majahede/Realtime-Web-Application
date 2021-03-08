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
    const tablebody = document.querySelector(`#nr${arg.iid}`)

    const issueString = hbsTemplate(arg)
    const tbody = document.createElement('tbody')
    tbody.innerHTML = issueString
    tbody.id = `nr${arg.iid}`
    if (arg.state) {
      tbody.classList.add('closed-issue')
    } else {
      tbody.classList.add('opened-issue')
    }
    const issueList = document.querySelector('#issue-list')

    if (tablebody) {
      issueList.replaceChild(tbody, tablebody)
    } else {
      issueList.prepend(tbody)
    }
  })
}
