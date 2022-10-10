import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import SideNavListGroup from './SideNavListGroup';

class ProductAccordian extends React.Component {
    render() {
        const accordianContent = Object.keys(this.props.items).map(key => {
            return (
                <Accordion.Item eventKey={key} key={key}>
                    <Accordion.Header>{key}</Accordion.Header>
                    <Accordion.Body>
                        <SideNavListGroup
                            items={this.props.items[key]}
                            activeItem={this.props.activeItem}
                            onClickListItem={this.props.onClickListItem} />
                    </Accordion.Body>
                </Accordion.Item>
            )
        })
        return (
            <Accordion defaultActiveKey={Object.keys(this.props.items)[0]}>
                {accordianContent}
            </Accordion>
        )
    }
}

export default ProductAccordian;