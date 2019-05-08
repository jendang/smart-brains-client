import React from 'react';
import Particles from 'react-particles-js'; //animate bg
import Clarifai from 'clarifai' //for face-dection API
import './App.css'

import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/SignUp/SignUp'

const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    },
  }
}

const app = new Clarifai.App({
  apiKey: 'b9a8ed341183472b90520b9da5aa9cbb'
});


class App extends React.Component {
  state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false
  }

  calculateFaceLocation = (data) => {
    const faceDetection = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    //console.log(width, height)
    //console.log(faceDetection)
    return {
      leftCol: faceDetection.left_col * width,
      topRow: faceDetection.top_row * height,
      rightCol: width - (faceDetection.right_col * width),
      bottomRow: height - (faceDetection.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    //console.log(box)
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    //console.log(event.target.value)
    this.setState({ input: event.target.value })
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
     
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({ isSignedIn: false})
    } else if (route === 'home'){
      this.setState({ isSignedIn: true})
    }
    this.setState({ route })
  }

  render(){
    const { isSignedIn, route, imageUrl, box  } = this.state
    return (
      <div className="App">
        <Particles params={particlesOption} className="particles" />
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange}/>

        {route === 'home' 
          ? 
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onSubmit}
            />
            <FaceRecognition 
              imageUrl={ imageUrl }
              box={ box }
            />
          </div>  
          : (
            route === 'signin' 
            ? 
            <SignIn onRouteChange={this.onRouteChange}/>
            :
            <SignUp onRouteChange={ this.onRouteChange }/>
            )
        }
        
      </div>
    );

  }
}

export default App;
