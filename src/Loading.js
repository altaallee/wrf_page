import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

class Loading extends React.Component {
    render() {
        return (
            <div id="loadingSpinner">
                <Spinner animation="border" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }
}

export default Loading;