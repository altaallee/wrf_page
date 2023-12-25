import React from 'react';
import { default as dt } from 'py-datetime';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideNavMaps from './SideNavMaps';
import TimeSeriesPannel from './TimeSeriesPannel';
import AlertMessage from './AlertMessage';
import Loading from './Loading';

class WrfTimeSeriesApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeSeriesData: "",
            currentProduct: "2-m Temperature",
            currentProductId: "t2m",
        }
        this.onProductClick = this.onProductClick.bind(this)
        this.onStationClick = this.onStationClick.bind(this)
    }

    products = [
        { name: "2-m Temperature", value: "t2m" }, 
        { name: "2-m Dewpoint", value: "dpt2m" }, 
        { name: "10-m Wind", value: "wind10m" }, 
        { name: "Precipitation", value: "precip" }, 
        { name: "SW Radiation", value: "swdown" }, 
    ]

    onProductClick(values) {
        this.setState({
            currentProduct: values.name,
            currentProductId: values.value,
        })
    }

    onStationClick(values) {
        this.setState({
            station: values.value,
        })
    }

    loadData() {
        let promise_init_data = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/times")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.setState({
                            initTimes: xhr.response,
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_init_data.then(() => { }).catch(() => {
            this.setState({
                initDataReadFail: true
            })
        })

        let promise_station_data = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/stations")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.setState({
                            stations: xhr.response,
                            station: xhr.response[0].value,
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_station_data.then(() => { }).catch(() => {
            this.setState({
                stationDataReadFail: true
            })
        })
    }

    getIndividualTimeSeries(domain, ens, init_date) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/time_series?domain=" + domain + "&ens=" + ens + "&init_date=" + init_date)
            xhr.responseType = "text"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        resolve(JSON.parse(xhr.responseText))
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })
    }

    getAllTimeSeries() {
        let promises = []
        this.state.initTimes.forEach((values) => {
            promises.push(
                this.getIndividualTimeSeries(
                    this.state.station, values.ens, values.value).then(
                        (data) => {
                            data = data[0]
                            data.name = values.name
                            return (data)
                        }
                    )
            )
        })

        Promise.all(promises).then((results) => {
            this.setState({
                timeSeriesData: results,
            })
        }).catch(() => {
            this.setState({
                timeSeriesDataReadFail: true
            })
        })
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.timeSeriesData === "") && this.state.initTimes && this.state.station) {
            this.getAllTimeSeries()
        }
        if (this.state.timeSeriesData && (prevState.station !== this.state.station)) {
            this.getAllTimeSeries()
        }
    }

    convertDatetime(time) {
        return (
            dt.datetime.strptime(time, "%Y-%m-%d %H:%M") - dt.datetime(1970, 1, 1)
        )
    }

    getProductTimeSeriesData() {
        const productsDetails = {
            "t2m": { title: "2-m Temperature", ytitle: "Temperature [°C]" },
            "dpt2m": { title: "2-m Dewpoint", ytitle: "Temperature [°C]" },
            "wind10m": {
                title: "10-m Wind", ytitle: "Wind Speed [m/s]",
                ytitle2: "Wind Direction [°]" },
            "precip": {
                title: "Precipitation",
                ytitle: "Accumulated Precipitation [mm]",
                ytitle2: "1-hr Precipitation [mm]" },
            "swdown": {
                title: "Surface Downward SW Radiation",
                ytitle: "Radiation [w/m^2]" },
        }
        var data
        if (this.state.currentProductId === "t2m") {
            data = this.state.timeSeriesData.map((run, j) => {
                const dataPairs = run.time.map((time, i) => {
                    return([this.convertDatetime(time), run.T2M[i]])
                })
                return (
                    {
                        name: run.name,
                        type: "line",
                        colorIndex: j,
                        data: dataPairs,
                        tooltip: {
                            valueSuffix: "°C",
                            valueDecimals: 1,
                        }
                    }
                )
            })
        } else if (this.state.currentProductId === "dpt2m") {
            data = this.state.timeSeriesData.map((run, j) => {
                const dataPairs = run.time.map((time, i) => {
                    return([this.convertDatetime(time), run.DPT2M[i]])
                })
                return (
                    {
                        name: run.name,
                        type: "line",
                        colorIndex: j,
                        data: dataPairs,
                        tooltip: {
                            valueSuffix: "°C",
                            valueDecimals: 1,
                        }
                    }
                )
            })
        } else if (this.state.currentProductId === "wind10m") {
            data = this.state.timeSeriesData.map((run, j) => {
                const dataPairs = run.time.map((time, i) => {
                    return([this.convertDatetime(time), run.WIND10M[i]])
                })
                return (
                    {
                        name: run.name,
                        type: "line",
                        colorIndex: j,
                        data: dataPairs,
                        tooltip: {
                            valueSuffix: " m/s",
                            valueDecimals: 1,
                        }
                    }
                )
            })
            data = data.concat(
                this.state.timeSeriesData.map((run, j) => {
                    const dataPairs2 = run.time.map((time, i) => {
                        return([this.convertDatetime(time), run.WIND10MDIR[i]])
                    })
                    return (
                        {
                            name: run.name,
                            type: "line",
                            lineWidth: 0,
                            yAxis: 1,
                            linkedTo: ":previous",
                            colorIndex: j,
                            data: dataPairs2,
                            tooltip: {
                                valueSuffix: "°",
                                valueDecimals: 0,
                            },
                            states: {
                                hover: {
                                    lineWidth: 0,
                                    lineWidthPlus: 0,
                                },
                            }
                        }
                    )
                })
            )
        } else if (this.state.currentProductId === "precip") {
            data = this.state.timeSeriesData.map((run, j) => {
                const dataPairs = run.time.map((time, i) => {
                    return([this.convertDatetime(time), run.QPFT[i]])
                })
                return (
                    {
                        name: run.name,
                        type: "line",
                        colorIndex: j,
                        data: dataPairs,
                        tooltip: {
                            valueSuffix: " mm",
                            valueDecimals: 1,
                        }
                    }
                )
            })
            data = data.concat(
                this.state.timeSeriesData.map((run, j) => {
                    const dataPairs2 = run.time.map((time, i) => {
                        return([this.convertDatetime(time), run.QPF1H[i]])
                    })
                    return (
                        {
                            name: run.name,
                            type: "column",
                            yAxis: 1,
                            showInLegend: false,
                            colorIndex: j,
                            data: dataPairs2,
                            tooltip: {
                                valueSuffix: "mm/hr",
                                valueDecimals: 1,
                            }
                        }
                    )
                })
            )
        } else if (this.state.currentProductId === "swdown") {
            data = this.state.timeSeriesData.map((run, j) => {
                const dataPairs = run.time.map((time, i) => {
                    return([this.convertDatetime(time), run.SWDOWN[i]])
                })
                return (
                    {
                        name: run.name,
                        type: "line",
                        colorIndex: j,
                        data: dataPairs,
                        tooltip: {
                            valueSuffix: " W/m^2",
                            valueDecimals: 0,
                        }
                    }
                )
            })
        }
        return ({
            accessibility: {
                enabled: false,
            },
            chart: {
                height: 800,
                zooming: {
                    type: "x",
                },
            },
            title: {
                text: productsDetails[this.state.currentProductId].title,
            },
            yAxis: [
                {
                    title: {
                        text: productsDetails[this.state.currentProductId].ytitle,
                        style: {
                            fontSize: "1em",
                        },
                    },
                    labels: {
                        style: {
                            fontSize: "1em",
                        },
                    },
                },
                {
                    title: {
                        text: productsDetails[this.state.currentProductId].ytitle2,
                        style: {
                            fontSize: "1em",
                        },
                    },
                    labels: {
                        style: {
                            fontSize: "1em",
                        },
                    },
                    opposite: true,
                },
            ],
            xAxis: {
                type: "datetime",
                labels: {
                    style: {
                        fontSize: "1em",
                    },
                },
            },
            tooltip: {
                shared: true,
            },
            legend: {
                itemStyle: {
                    fontSize: "1em",
                },
            },
            series: data,
        })
    }

    render() {
        if (this.state.initTimes && this.state.station && (this.state.timeSeriesData !== "")) {
            return (
                <Container fluid>
                    <Row>
                        <Col xl={3}>
                            <SideNavMaps
                                initTimes={this.products}
                                currentInit={this.state.currentProduct}
                                onInitTimeClick={this.onProductClick}
                                domains={this.state.stations}
                                domain={this.state.station}
                                onDomainClick={this.onStationClick} />
                        </Col>
                        <Col xl={9}>
                            <TimeSeriesPannel
                                data={this.getProductTimeSeriesData()} />
                        </Col>
                    </Row>
                </Container>
            )
        } else if (this.state.initDataReadFail) {
            return (
                <AlertMessage message="Failed to get model run data." />
            )
        } else if (this.state.stationDataReadFail) {
            return (
                <AlertMessage message="Failed to get station data." />
            )
        } else if (this.state.timeSeriesDataReadFail) {
            return (
                <AlertMessage message="Failed to get time series data." />
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

export default WrfTimeSeriesApp;
