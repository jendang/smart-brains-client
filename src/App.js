import React from 'react';
import Particles from 'react-particles-js'; //animate bg
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



const initialState = {
  input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      email: '',
      name: '',
      entries: 0,
      joined: ''
    }
}
class App extends React.Component {
  state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      email: '',
      name: '',
      entries: 0,
      joined: ''
    }
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      email: data.email,
      name: data.name,
      entries: data.entries,
      join: data.joined
      }
    })
  }

  //testing fetch data from server
  /* componentDidMount() {
    const baseUrl = 'http://localhost:4000' //root from server
    fetch(baseUrl)
      .then(response => response.json())
      .then(console.log)
  } */

  calculateFaceLocation = (data) => {
    const faceDetection = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: faceDetection.left_col * width,
      topRow: faceDetection.top_row * height,
      rightCol: width - (faceDetection.right_col * width),
      bottomRow: height - (faceDetection.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    fetch('https://image-face-detection.herokuapp.com/imageurl', {
      method: 'post',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
      .then(response => {
        if(response){
          fetch('https://image-face-detection.herokuapp.com/image', {
            method: 'put',
            headers: {
              'content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: this.state.user.id, 
            })
          })
            .then(response => response.json())
            .then(count => {
              /* this.setState({ user: {
                entries: count
              }}) ==> will change the whole user obj*/ 

              //Object.assign(obj, the property) 
              // will change only entries in user obj
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }//if
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
     
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
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
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
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
            <SignIn loadUser={ this.loadUser } onRouteChange={this.onRouteChange}/>
            :
            <SignUp loadUser={ this.loadUser} onRouteChange={ this.onRouteChange }/>
            )
        }
        
      </div>
    );

  }
}

export default App;
