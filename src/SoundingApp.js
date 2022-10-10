import React from 'react';
import { default as dt } from 'py-datetime';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideNavSoundings from './SideNavSoundings';
import MainSounding from './SoundingPannel';
import Alert from 'react-bootstrap/Alert';
import Loading from './Loading';

class SoundingApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            station: "Auckland",
            minFcstHour: 0,
            maxFcstHour: 48,
            fcstStep: 1,
            fcstHour: 0,
        }
        this.onInitTimeClick = this.onInitTimeClick.bind(this)
        this.onStationClick = this.onStationClick.bind(this)
        this.onChangeFcstSlider = this.onChangeFcstSlider.bind(this)
        this.onFirstHourClick = this.onFirstHourClick.bind(this)
        this.onPreviousHourClick = this.onPreviousHourClick.bind(this)
        this.onNextHourClick = this.onNextHourClick.bind(this)
        this.onLastHourClick = this.onLastHourClick.bind(this)
    }

    onInitTimeClick(initTime) {
        const newInitTime = dt.datetime.strptime(initTime, "%Y%m%d%H")
        this.setState({
            initTime: newInitTime
        })
        if (newInitTime > this.state.currentTime) {
            this.setState({
                fcstHour: 0,
                currentTime: newInitTime
            })
        } else if (dt.datetime(newInitTime + dt.timedelta({ hours: this.state.maxFcstHour })) < this.state.currentTime) {
            this.setState({
                fcstHour: this.state.maxFcstHour,
                currentTime: dt.datetime(newInitTime + dt.timedelta({ hours: this.state.maxFcstHour }))
            })
        } else {
            this.setState({
                fcstHour: dt.timedelta(this.state.currentTime - newInitTime).totalSeconds() / 3600
            })
        }
    }

    onStationClick(station) {
        this.setState({
            station: station
        })
    }

    onChangeFcstSlider(fcstHour) {
        this.setState({
            fcstHour: fcstHour,
            currentTime: dt.datetime(this.state.initTime + dt.timedelta({ hours: fcstHour }))
        })
    }

    onFirstHourClick() {
        this.setState({
            fcstHour: this.state.minFcstHour,
            currentTime: this.state.initTime
        })
    }
    onPreviousHourClick() {
        this.setState((state) => ({
            fcstHour: state.fcstHour - this.state.fcstStep,
            currentTime: dt.datetime(state.currentTime - dt.timedelta({ hours: this.state.fcstStep }))
        }))
    }
    onNextHourClick() {
        this.setState((state) => ({
            fcstHour: +state.fcstHour + +this.state.fcstStep,
            currentTime: dt.datetime(state.currentTime + dt.timedelta({ hours: this.state.fcstStep }))
        }))
    }
    onLastHourClick() {
        this.setState({
            fcstHour: this.state.maxFcstHour,
            currentTime: dt.datetime(this.state.initTime + dt.timedelta({ hours: this.state.maxFcstHour }))
        })
    }

    loadData() {
        let promise_data = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/times")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.setState({
                            initTimes: xhr.response,
                            currentTime: dt.datetime.strptime(xhr.response[0].value, "%Y%m%d%H"),
                            initTime: dt.datetime.strptime(xhr.response[0].value, "%Y%m%d%H"),
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_data.then(() => { }).catch(() => {
            this.setState({
                dataReadFail: true
            })
        })
    }

    componentDidMount() {
        this.loadData()
    }

    stations = [
        { name: "Auckland", value: "Auckland" },
        { name: "Christchurch", value: "Christchurch" },
    ]

    render() {
        if (this.state.currentTime & this.state.initTime) {
            return (
                <Container fluid>
                    <Row>
                        <Col xl={3}>
                            <SideNavSoundings
                                initTimes={this.state.initTimes}
                                onInitTimeClick={this.onInitTimeClick}
                                stations={this.stations}
                                station={this.state.station}
                                onStationClick={this.onStationClick} />
                        </Col>
                        <Col xl={9}>
                            <MainSounding
                                minFcstHour={this.state.minFcstHour}
                                maxFcstHour={this.state.maxFcstHour}
                                fcstHour={this.state.fcstHour}
                                onChangeFcstSlider={this.onChangeFcstSlider}
                                currentTime={this.state.currentTime.strftime("%Y%m%d%H")}
                                initTime={this.state.initTime.strftime("%Y%m%d%H")}
                                onFirstHourClick={this.onFirstHourClick}
                                onPreviousHourClick={this.onPreviousHourClick}
                                onNextHourClick={this.onNextHourClick}
                                onLastHourClick={this.onLastHourClick}
                                station={this.state.station} />
                        </Col>
                    </Row>
                </Container>
            )
        } else if (this.state.dataReadFail) {
            return (
                <Alert id="alertMessage" variant="danger">
                    Failed to get model init times.
                </Alert>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

export default SoundingApp;