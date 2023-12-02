import React from 'react';
import DropdownSelect from './DropdownSelect';
import ProductAccordian from './ProductAccordian';
import SideNavListGroup from './SideNavListGroup';

class SideNavMaps extends React.Component {
    render() {
        return (
            <div id="sideNavMaps">
                <DropdownSelect
                    items={this.props.initTimes}
                    activeItem={this.props.currentInit}
                    onClickDropdownItem={this.props.onInitTimeClick} />
                <SideNavListGroup
                    items={this.props.domains}
                    activeItem={this.props.domain}
                    onClickListItem={this.props.onDomainClick} />
                {this.props.product && 
                    <ProductAccordian
                        items={this.props.products}
                        activeItem={this.props.product}
                        onClickListItem={this.props.onProductClick} />}
            </div>
        )
    }
}

export default SideNavMaps;
