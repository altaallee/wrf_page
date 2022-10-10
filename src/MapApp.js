import React from 'react';
import { default as dt } from 'py-datetime';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideNavMaps from './SideNavMaps';
import MainMap from './MainMap';
import Alert from 'react-bootstrap/Alert';
import Loading from './Loading';

class MapViewer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            domain: "nz",
            product: "T2M",
            minFcstHour: 0,
            maxFcstHour: 48,
            fcstStep: 1,
            fcstHour: 0,
        }
        this.onInitTimeClick = this.onInitTimeClick.bind(this)
        this.onDomainClick = this.onDomainClick.bind(this)
        this.onProductClick = this.onProductClick.bind(this)
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

    onDomainClick(domain) {
        this.setState({
            domain: domain
        })
    }

    onProductClick(product) {
        this.setState({
            product: product
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
                            currentTime: dt.datetime.strptime(xhr.response[0].filename, "%Y%m%d%H"),
                            initTime: dt.datetime.strptime(xhr.response[0].filename, "%Y%m%d%H"),
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

    products = {
        "Surface": [
            { name: "2-m Temperature", filename: "T2M" },
            { name: "2-m Apparent Temperature", filename: "TA2M" },
            { name: "2-m Dew Point", filename: "DPT2M" },
            { name: "10-m Wind", filename: "WIND10M" },
            { name: "2-m Relative Humidity", filename: "RH2M" },
        ],
        "Precipitation": [
            { name: "1-hr Precipitation", filename: "QPF1H" },
            { name: "Total Precipitation", filename: "QPF" },
            { name: "Composite Reflectivity", filename: "DBZCOMP" },
            { name: "1km Reflectivity", filename: "DBZ1KM" },
            { name: "Precipitable Water", filename: "PWAT" },
            { name: "Integrated Vapor Transport", filename: "IVT" },
        ],
        "Upper Air Dynamics": [
            { name: "500mb Vertical Velocity", filename: "OMEGA500" },
            { name: "700mb Vertical Velocity", filename: "OMEGA700" },
            { name: "850mb Vertical Velocity", filename: "OMEGA850" },
            { name: "500mb Vorticity", filename: "VORT500" },
            { name: "700mb Vorticity", filename: "VORT700" },
            { name: "850mb Vorticity", filename: "VORT850" },
        ],
        "Upper Air Wind": [
            { name: "250mb Wind", filename: "WIND250" },
            { name: "500mb Wind", filename: "WIND500" },
            { name: "700mb Wind", filename: "WIND700" },
            { name: "850mb Wind", filename: "WIND850" },
            { name: "925mb Wind", filename: "WIND925" },
        ],
        "Upper Air Temperature": [
            // { name: "", filename: "" },
            { name: "500mb Temperature", filename: "T500" },
            { name: "700mb Temperature", filename: "T700" },
            { name: "850mb Temperature", filename: "T850" },
            { name: "925mb Temperature", filename: "T925" },
        ],
        "Upper Air Moisture": [
            { name: "250mb Relative Humidity", filename: "RH250" },
            { name: "500mb Relative Humidity", filename: "RH500" },
            { name: "700mb Relative Humidity", filename: "RH700" },
            { name: "850mb Relative Humidity", filename: "RH850" },
            { name: "925mb Relative Humidity", filename: "RH925" },
        ],
        "Cloud Cover": [
            { name: "High Cloud Cover", filename: "CLOUDCOVERHIGH" },
            { name: "Mid Cloud Cover", filename: "CLOUDCOVERMID" },
            { name: "Low Cloud Cover", filename: "CLOUDCOVERLOW" },
        ],
        "Severe": [
            { name: "Surface Based CAPE", filename: "CAPESFC" },
            { name: "Most Unstable CAPE", filename: "CAPEMU" },
            { name: "Surface Based CIN", filename: "CINSFC" },
            { name: "700-500mb Lapse Rate", filename: "LR700500" },
        ],
        "Winter": [
            { name: "1-hr Snowfall", filename: "SNOW1H" },
            { name: "Total Snowfall", filename: "SNOWTOTAL" },
            { name: "Snow Depth", filename: "SNOWDEPTH" },
        ],
        "Radiation": [
            { name: "Outgoing Longwave Radiation", filename: "OLR" },
            { name: "Surface Downward Shortwave Radiation", filename: "SWDOWN" },
        ],
    }

    domains = [
        { name: "New Zealand", filename: "nz" },
        { name: "North Island", filename: "north_island" },
        { name: "South Island", filename: "south_island" },
        { name: "Auckland", filename: "auckland" },
    ]

    render() {
        if (this.state.currentTime & this.state.initTime) {
            return (
                <Container fluid>
                    <Row>
                        <Col xl={3}>
                            <SideNavMaps
                                initTimes={this.state.initTimes}
                                onInitTimeClick={this.onInitTimeClick}
                                domains={this.domains}
                                domain={this.state.domain}
                                onDomainClick={this.onDomainClick}
                                products={this.products}
                                product={this.state.product}
                                onProductClick={this.onProductClick} />
                        </Col>
                        <Col xl={9}>
                            <MainMap
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
                                domain={this.state.domain}
                                product={this.state.product} />
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

export default MapViewer;