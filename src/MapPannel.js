import React from 'react';
import Slider from './Slider';
import HourButtons from './HourButtons';
import ImageDisplay from './ImageDisplay';

class MainMap extends React.Component {
    render() {
        return (
            <div id="mainMap">
                <Slider
                    min={this.props.minFcstHour}
                    max={this.props.maxFcstHour}
                    value={this.props.fcstHour}
                    onChangeSlider={this.props.onChangeFcstSlider} />
                <HourButtons
                    minFcstHour={this.props.minFcstHour}
                    maxFcstHour={this.props.maxFcstHour}
                    fcstHour={this.props.fcstHour}
                    onFirstHourClick={this.props.onFirstHourClick}
                    onPreviousHourClick={this.props.onPreviousHourClick}
                    onNextHourClick={this.props.onNextHourClick}
                    onLastHourClick={this.props.onLastHourClick} />
                <ImageDisplay
                    src={"/model_images/images/" + this.props.initTime + "/" + this.props.product + "_" + this.props.domain + "_" + this.props.currentTime + ".png"} />
            </div>
        )
    }
}

export default MainMap;