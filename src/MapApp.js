import React from 'react';
import { default as dt } from 'py-datetime';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideNavMaps from './SideNavMaps';
import MapPannel from './MapPannel';
import Loading from './Loading';
import AlertMessage from './AlertMessage';

class MapApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product: "T2M",
            productFreq: 0.25,
            productMaxDom: 99,
            minFcstHour: 0,
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

    onInitTimeClick(values) {
        const newInitTime = dt.datetime.strptime(values.value, "%Y%m%d%H")
        this.setState({
            initTime: newInitTime,
            currentInit: values.name,
            maxFcstHour: values.fcsthours,
            ens: values.ens
        })
        if (newInitTime > this.state.currentTime) {
            // new model start time is past the current time
            this.setState({
                fcstHour: 0,
                currentTime: newInitTime
            })
        } else if (dt.datetime(newInitTime + dt.timedelta({ hours: values.fcsthours })) < this.state.currentTime) {
            // new model run does not forecast up to current hour
            this.setState({
                fcstHour: values.fcsthours,
                currentTime: dt.datetime(newInitTime + dt.timedelta({ hours: values.fcsthours }))
            })
        } else {
            // new model run has forecast in current hour
            this.setState({
                fcstHour: dt.timedelta(this.state.currentTime - newInitTime).totalSeconds() / 3600
            })
        }
    }

    onDomainClick(values) {
        const newFreq = Math.max(values.freq, this.state.productFreq)
        const newFcstHour = Math.round(this.state.fcstHour / newFreq) * newFreq
        this.setState({
            domain: values.value,
            domNum: values.domNum,
            domainFreq: values.freq,
            fcstStep: newFreq,
            fcstHour: newFcstHour,
            currentTime: dt.datetime(this.state.initTime + dt.timedelta({ hours: newFcstHour }))
        })
        if (values.domNum > this.state.productMaxDom) {
            this.setState({
                product: "T2M",
                productFreq: values.freq,
                productMaxDom: 99,
            })
        }
    }

    onProductClick(values) {
        const newFreq = Math.max(values.freq, this.state.domainFreq)
        const newFcstHour = Math.round(this.state.fcstHour / newFreq) * newFreq
        this.setState({
            product: values.value,
            productFreq: values.freq,
            productMaxDom: values.maxDom,
            fcstStep: newFreq,
            fcstHour: newFcstHour,
            currentTime: dt.datetime(this.state.initTime + dt.timedelta({ hours: newFcstHour }))
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
                            currentTime: dt.datetime.strptime(xhr.response[0].value, "%Y%m%d%H"),
                            initTime: dt.datetime.strptime(xhr.response[0].value, "%Y%m%d%H"),
                            currentInit: xhr.response[0].name,
                            maxFcstHour: xhr.response[0].fcsthours,
                            ens: xhr.response[0].ens
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

        let promise_domain_data = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/domains")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.setState({
                            domains: xhr.response,
                            domain: xhr.response[0].value,
                            domNum: xhr.response[0].domNum,
                            fcstStep: xhr.response[0].freq,
                            domainFreq: xhr.response[0].freq
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_domain_data.then(() => { }).catch(() => {
            this.setState({
                domainDataReadFail: true
            })
        })

        let promise_product_data = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://127.0.0.1:8000/wrf/products")
            xhr.responseType = "json"
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    if (status >= 200 && status < 400) {
                        this.setState({
                            products: xhr.response
                        })
                        resolve()
                    } else {
                        reject()
                    }
                }
            }
            xhr.send()
        })

        promise_product_data.then(() => { }).catch(() => {
            this.setState({
                productDataReadFail: true
            })
        })
    }

    componentDidMount() {
        this.loadData()
    }

    getProducts() {
        let filteredProducts = {}
        for (const category in this.state.products) {
            let keepProducts = []
            for (const product in this.state.products[category]) {
                if (this.state.products[category][product]["maxDom"] >= this.state.domNum) {
                    keepProducts.push(this.state.products[category][product])
                }
            }
            filteredProducts = Object.assign(filteredProducts, { [category]: keepProducts })
        }
        return (filteredProducts)
    }

    render() {
        if (this.state.currentInit && this.state.domain && this.state.products) {
            return (
                <Container fluid>
                    <Row>
                        <Col xl={3}>
                            <SideNavMaps
                                initTimes={this.state.initTimes}
                                currentInit={this.state.currentInit}
                                onInitTimeClick={this.onInitTimeClick}
                                domains={this.state.domains}
                                domain={this.state.domain}
                                onDomainClick={this.onDomainClick}
                                products={this.getProducts()}
                                product={this.state.product}
                                onProductClick={this.onProductClick} />
                        </Col>
                        <Col xl={9}>
                            <MapPannel
                                minFcstHour={this.state.minFcstHour}
                                maxFcstHour={this.state.maxFcstHour}
                                fcstStep={this.state.fcstStep}
                                fcstHour={this.state.fcstHour}
                                onChangeFcstSlider={this.onChangeFcstSlider}
                                currentTime={this.state.currentTime.strftime("%Y%m%d%H%M")}
                                initTime={this.state.initTime.strftime("%Y%m%d%H")}
                                ens={this.state.ens}
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
        } else if (this.state.initDataReadFail) {
            return (
                <AlertMessage message="Failed to get model run data." />
            )
        } else if (this.state.domainDataReadFail) {
            return (
                <AlertMessage message="Failed to get domain data." />
            )
        } else {
            return (
                <Loading />
            )
        }
    }
}

export default MapApp;