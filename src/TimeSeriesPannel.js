import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class TimeSeriesPannel extends React.Component {
    render() {
        return (
            <div id="mapPannel">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.props.data} />
            </div>
        )
    }
}

export default TimeSeriesPannel;
