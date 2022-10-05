import React from 'react';
import Button from 'react-bootstrap/Button';

class HourButtons extends React.Component {
    constructor(props) {
        super(props)
        this.onFirstHourClick = this.onFirstHourClick.bind(this)
        this.onPreviousHourClick = this.onPreviousHourClick.bind(this)
        this.onNextHourClick = this.onNextHourClick.bind(this)
        this.onLastHourClick = this.onLastHourClick.bind(this)
    }

    onFirstHourClick() {
        this.props.onFirstHourClick()
    }

    onPreviousHourClick() {
        this.props.onPreviousHourClick()
    }

    onNextHourClick() {
        this.props.onNextHourClick()
    }

    onLastHourClick() {
        this.props.onLastHourClick()
    }


    render() {
        return (
            <div id="hourButtons">
                <Button
                    variant="primary"
                    disabled={+this.props.fcstHour === +this.props.minFcstHour}
                    onClick={this.onFirstHourClick}>
                    <i className="bi bi-skip-backward-fill"></i>
                </Button>{' '}
                <Button
                    variant="primary"
                    disabled={+this.props.fcstHour === +this.props.minFcstHour}
                    onClick={this.onPreviousHourClick}>
                    <i className="bi bi-rewind-fill"></i>
                </Button>{' '}
                <Button
                    variant="primary"
                    disabled={+this.props.fcstHour === +this.props.maxFcstHour}
                    onClick={this.onNextHourClick}>
                    <i className="bi bi-fast-forward-fill"></i>
                </Button>{' '}
                <Button
                    variant="primary"
                    disabled={+this.props.fcstHour === +this.props.maxFcstHour}
                    onClick={this.onLastHourClick}>
                    <i className="bi bi-skip-forward-fill"></i>
                </Button>
            </div>
        )
    }
}

export default HourButtons;