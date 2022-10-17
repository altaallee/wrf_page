import React from 'react';
import Alert from 'react-bootstrap/Alert';

class AlertMessage extends React.Component {
    render() {
        return (
            <Alert id="alertMessage" variant="danger">
                {this.props.message}
            </Alert>
        )
    }
}

export default AlertMessage;