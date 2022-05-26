import { Nav, Navbar, Container, Button, ToggleButton } from "react-bootstrap";
import {useState, useEffect, useContext} from 'react';
import { Switch } from '@chakra-ui/core'
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
          Use Gasless mode ?  <Switch isChecked={isGasless}  onChange={(e) => toogleGasMode()} size='sm' />
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
