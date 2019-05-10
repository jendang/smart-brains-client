import React from 'react'
 

class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        name: ''
    }

    onNameChange = (event) => {
        this.setState({ name: event.target.value })
    }
    
    onEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onSubmitSignUp = (event) => {
        event.preventDefault()
        //console.log(this.state)
        fetch('http://localhost:4000/signup', {
            method: 'post',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(user => { 
                if(user) {
                    this.props.loadUser(user)
                    this.props.onRouteChange('home')
                }
            })
            .catch(console.log) 
    }
    
    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80 center">
                    <form className="measure center">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign Up</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" forhtml="name">Name</label>
                                <input 
                                    onChange={ this.onNameChange }
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="name"  
                                    id="name" 
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" forhtml="email-address">Email</label>
                                <input 
                                    onChange={ this.onEmailChange }
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" forhtml="password">Password</label>
                                <input 
                                    onChange={ this.onPasswordChange }
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password" 
                                />
                            </div>
                            <div className="">
                                <input 
                                    onClick={ this.onSubmitSignUp }
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                    type="submit" 
                                    value="Submit" 
                                />
                            </div>
                        </fieldset>
                    </form>
                </main>
            </article>
        )

    }
}

export default SignUp