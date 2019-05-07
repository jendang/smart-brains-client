import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = (props) => {
    return(
        <div>
            <p className="f3">
                This Magic Brain will detect faces in your pictures, give it a try! 
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input 
                        onChange={props.onInputChange}
                        className="f4 pa2 w-70 center" 
                        type="text" 
                    />
                    <button 
                        className="w-20 grow f4 link ph3 pv2 dib white bg-light-purple"
                        onClick={props.onButtonSubmit}
                    >
                        Detect
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm