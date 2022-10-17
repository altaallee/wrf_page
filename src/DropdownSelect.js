import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

class DropdownSelect extends React.Component {
    constructor(props) {
        super(props)
        this.onClickDropdownItem = this.onClickDropdownItem.bind(this)
    }

    onClickDropdownItem(e) {
        this.props.onClickDropdownItem(e)
    }

    render() {
        const dropdownItems = this.props.items.map((values) => {
            return (
                <Dropdown.Item
                    active={this.props.activeItem === values.name}
                    as="button"
                    onClick={() => this.onClickDropdownItem(values)}
                    key={values.name}>
                    {values.name}
                </Dropdown.Item>
            )
        })
        return (
            <Dropdown>
                <Dropdown.Toggle>
                    {this.props.activeItem}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {dropdownItems}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default DropdownSelect;