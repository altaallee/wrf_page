import React from 'react';
import Slider from './Slider';
import HourButtons from './HourButtons';
import ImageDisplay from './ImageDisplay';

class SoundingPannel extends React.Component {
    render() {
        return (
            <div id="mapPannel">
                <Slider
                    min={this.props.minFcstHour}
                    max={this.props.maxFcstHour}
                    step={this.props.fcstStep}
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
                    src={"/model_images/images/" + this.props.initTime + "/skewt/" + this.props.station + "/skewt_" + this.props.station + "_" + this.props.currentTime + ".png"} />
            </div>
        )
    }
}

export default SoundingPannel;