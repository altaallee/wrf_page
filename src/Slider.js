import React from 'react';
import Form from 'react-bootstrap/Form';

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.onChangeSlider = this.onChangeSlider.bind(this)
    }

    onChangeSlider(e) {
        this.props.onChangeSlider(e.target.value)
    }

    render() {
        return (
            <Form.Range
                min={this.props.min}
                max={this.props.max}
                value={this.props.value}
                onChange={(e) => this.onChangeSlider(e)} />
        )
    }
}

export default Slider;