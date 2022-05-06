import React, { useRef, useCallback } from "react";
import { Card, Table, CloseButton, Form } from "react-bootstrap";
import { useHttp } from "../hooks/http.hook";

const ProductsList = ({ items, setItems, delFunc, token }) => {
  const { request } = useHttp();

  const nameRefs = useRef([]);
  const descRefs = useRef([]);

  const updateRequest = useCallback(
    (id, field, e) => {
      const newValue = e.target.value;

      request(
        "/api/product/edit",
        "PUT",
        JSON.stringify({ id: id, field, newValue }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
    },
    [request, token]
  );

  const handleChangeItem = useCallback(
    (id, field, e) => {
      const newValue = e.target.value;

      const newItems = items.map((item) =>
        item._id === id ? { ...item, [field]: newValue } : item
      );
      setItems(newItems);
      //   console.log(items);
    },
    [items, setItems]
  );

  const delHandler = (e) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить позицию ${e.target.value}?`
      )
    ) {
      delFunc(e.target.id);
    }
  };

  // console.log(items);

  return (
    <>
      <Card style={{ margin: "50px 0 50px 0" }}>
        <Card.Header>Добавленные</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td></td>
                  <td>Наименование</td>
                  <td>Описание</td>
                  <td>Изображение</td>
                </tr>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td key={item._id}>
                      <CloseButton
                        id={item._id}
                        key={item._id}
                        value={item.name}
                        onClick={delHandler}
                      />
                    </td>
                    <td>
                      <Form.Control
                        value={item.name}
                        onChange={(e) => {
                          handleChangeItem(item._id, "name", e);
                          updateRequest(item._id, "name", e);
                        }}
                        ref={(element) => {
                          nameRefs.current[item._id] = element;
                        }}
                      />
                    </td>

                    <td>
                      <Form.Control
                        as="textarea"
                        value={item.description}
                        rows={3}
                        onChange={(e) => {
                          handleChangeItem(item._id, "description", e);
                          updateRequest(item._id, "description", e);
                        }}
                        ref={(element) => {
                          descRefs.current[item._id] = element;
                        }}
                      />
                    </td>

                    <td>
                      <img
                        style={{ height: "100px" }}
                        src={"/images/" + item.image}
                        alt={item.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </blockquote>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductsList;
