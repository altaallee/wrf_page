import React from 'react';
import Form from 'react-bootstrap/Form';

class DropdownSelect extends React.Component {
    constructor(props) {
        super(props)
        this.onClickDropdownItem = this.onClickDropdownItem.bind(this)
    }

    onClickDropdownItem(e) {
        this.props.onClickDropdownItem(e.target.value)
    }

    render() {
        const formItems = this.props.items.map((values) => {
            return (
                <option
                    value={values.value}
                    key={values.value} >
                    {values.name}
                </option>)
        })
        return (
            <div>
                <Form.Select onChange={(e) => this.onClickDropdownItem(e)}>
                    {formItems}
                </Form.Select>
            </div>
        )
    }
}

export default DropdownSelect;