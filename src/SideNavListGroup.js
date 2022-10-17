import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

class SideNavListGroup extends React.Component {
    constructor(props) {
        super(props)
        this.onClickListItem = this.onClickListItem.bind(this)
    }

    onClickListItem(values) {
        this.props.onClickListItem(values)
    }

    render() {
        const listItems = this.props.items.map((values) => {
            return (
                <ListGroup.Item
                    action
                    active={this.props.activeItem === values.value}
                    key={values.value}
                    onClick={() => this.onClickListItem(values)} >
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