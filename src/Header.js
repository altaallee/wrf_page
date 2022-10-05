import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class Header extends React.Component {
    render() {
        return (
            <Navbar bg="primary" variant="dark" expand="md">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            src="https://cdn.discordapp.com/emojis/567684405527838720.webp?size=48&quality=lossless"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="jerry"
                        />
                        {' '}Jerry
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/mapviewer">Maps</Nav.Link>
                            <Nav.Link href="/soundingviewer">Soundings</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default Header;