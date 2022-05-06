import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

export const NavbarCmp = () => {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    navigate("/");
  };
  return (
    <Navbar
      expanded={expanded}
      bg="light"
      aria-controls="basic-navbar-nav"
      expand="md"
      sticky="top"
    >
      <Container>
        {/* <Navbar.Brand href="#home"></Navbar.Brand> */}
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <NavLink className="nav-link" to='/dashboard'>Сводка</NavLink> 
      <NavLink className="nav-link" to='/orders'>Заказы</NavLink>
      <NavLink  className="nav-link" to='/clients'>Клиенты</NavLink> */}

            <NavLink
              className="nav-link"
              to="/addcategory"
              // onClick={() => setExpanded(false)}
            >
              Категории
            </NavLink>
            <NavLink
              className="nav-link"
              to="/addproduct"
              // onClick={() => setExpanded(false)}
            >
              Продукты
            </NavLink>
            <NavLink
              className="nav-link"
              to="/addvariant"
              // onClick={() => setExpanded(false)}
            >
              Варианты
            </NavLink>

            <NavLink className="nav-link" to="/" onClick={logoutHandler}>
              Выйти
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
