import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

class SideNavListGroup extends React.Component {
    constructor(props) {
        super(props)
        this.onClickListItem = this.onClickListItem.bind(this)
    }

    onClickListItem(key) {
        this.props.onClickListItem(key)
    }

    render() {
        const listItems = this.props.items.map((values) => {
            return (
                <ListGroup.Item
                    action
                    active={this.props.activeItem === values.filename}
                    key={values.filename}
                    onClick={() => this.onClickListItem(values.filename)} >
                    {values.name}
                </ListGroup.Item>
            )
        })
        return (
            <ListGroup>
                {listItems}
            </ListGroup>
        )
    }
}

export default SideNavListGroup;