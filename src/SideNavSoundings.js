import React from 'react';
import DropdownSelect from './DropdownSelect';
import SideNavListGroup from './SideNavListGroup';

class SideNavSoundings extends React.Component {
    render() {
        return (
            <div id="sideNavMaps">
                <DropdownSelect
                    items={this.props.initTimes}
                    onClickDropdownItem={this.props.onInitTimeClick} />
                <SideNavListGroup
                    items={this.props.stations}
                    activeItem={this.props.station}
                    onClickListItem={this.props.onStationClick} />
            </div>
        )
    }
}

export default SideNavSoundings;