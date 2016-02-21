const ReactDOM = require('react-dom')
const React = require('react')

window.React = React

let Index = require('./components/index.js')

ReactDOM.render(
  <Index />,
  document.getElementById('content')
)
