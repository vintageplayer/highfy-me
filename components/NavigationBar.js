import { Nav, Navbar, Container, Button, ToggleButton } from "react-bootstrap";
import {useState, useEffect, useContext} from 'react';
import UserContext from "../context/user/UserContext";

const NavigationBar = ({ disconnectHandler, address, credits }) => {
  const {toogleGasMode, isGasless} = useContext(UserContext);

  return (
    <Navbar expand="lg" variant="light">
      <Container>
        <Navbar.Brand href="#home">HighFy Me</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Text>
            Credits: <b>{credits}</b>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">{address}</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <ToggleButton
            className="mb-2"
            id="toggle-check"
            type="checkbox"
            variant="outline-primary"
            checked={isGasless}
            value="1"
            onChange={(e) => toogleGasMode()}
          >
            { isGasless ? (
              <Navbar.Text>Gasless mode</Navbar.Text>
            ) : (
              <Navbar.Text>Transaction mode</Navbar.Text>
            )
          }
          </ToggleButton>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-success" onClick={disconnectHandler}>
            Log Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavigationBar;
