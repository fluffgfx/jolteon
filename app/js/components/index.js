const React = require('react')

module.exports = class Index extends React.Component {
  constructor (props) {
    super(props)
    const shiny = ((Math.random() * 8192) > 8191)
    const image = shiny ? 'assets/sprite_shiny.png' : 'assets/sprite.png'
    this.state = {
      shiny: shiny,
      image_src: image
    }
  }

  render () {
    return (
      <div>
        <h1>Congratulations! Jolteon was caught!</h1>
        <img src={this.state.image_src} />
        <h2>To get started, look through the code in app/ and src/. And don't forget to have fun!</h2>
      </div>
    )
  }
}
