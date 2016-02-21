module.exports = React.createClass({
  getInitialState () {
    let shiny = ((Math.random() * 8192) > 8191)
    let image = shiny ? 'assets/sprite_shiny.png' : 'assets/sprite.png'
    return {
      shiny: shiny,
      image_src: image
    }
  },

  render () {
    return (
      <div>
        <h1>Congratulations! Jolteon was caught!</h1>
        <img src={this.state.image_src} />
        <h2>To get started, look through the code in app/ and src/. And don't forget to have fun!</h2>
      </div>
    )
  }
})
