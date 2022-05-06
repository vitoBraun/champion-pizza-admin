import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Container, Card } from "react-bootstrap";
import AlertBlock from "../components/AlertBlock";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [noticeError, setNoticeError] = useState(false);

  useEffect(() => {
    setNoticeError(error);
  }, [error]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request(
        "/api/auth/register",
        "POST",
        JSON.stringify({ ...form }),
        { "Content-Type": "application/json" }
      );
      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request(
        "/api/auth/login",
        "POST",
        JSON.stringify({ ...form }),
        { "Content-Type": "application/json" }
      );
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <Container
      onClick={() => {
        clearError();
      }}
    >
      <AlertBlock noticeError={noticeError} />
      <Card style={{ width: "20rem" }}>
        <Card.Body>
          <Card.Title>Авторизиция</Card.Title>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите email"
                id="email"
                name="email"
                className="validate"
                onChange={changeHandler}
                value={form.email}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите пароль"
                id="password"
                name="password"
                className="validate"
                onChange={changeHandler}
                value={form.password}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={loginHandler}
              disabled={loading}
            >
              Войти
            </Button>
            {/* <Button 
        className="btn grey lighten-1 black-text">
        Регистрация
        </Button> */}
          </Form>
          <Card.Link onClick={registerHandler} disabled={loading}>
            Регистрация
          </Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};
