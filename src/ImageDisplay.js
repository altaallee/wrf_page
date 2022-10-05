import React from 'react';

class ImageDisplay extends React.Component {
    render() {
        return (
            <img src={this.props.src} alt="weather map"/>
        )
    }
}

export default ImageDisplay;