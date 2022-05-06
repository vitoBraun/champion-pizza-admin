import React from "react";
import { Card, Table, CloseButton } from "react-bootstrap";

const ItemsList = ({ items, itemName, delFunc }) => {
  const delHandler = (e) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить позицию ${e.target.value}?`
      )
    ) {
      delFunc(e.target.id);
    }
  };
  return (
    <>
      <Card style={{ margin: "50px 0 50px 0" }}>
        <Card.Header>Добавленные</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <Table striped bordered hover size="md">
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td key={item._id}>
                      <CloseButton
                        id={item._id}
                        key={item._id}
                        value={item[itemName]}
                        onClick={delHandler}
                      />
                      {item[itemName]}
                      {itemName === "categoryName" && (
                        <> {item.categoryOrder}</>
                      )}
                      {itemName === "name" && (
                        <>
                          <img
                            style={{ height: "100px" }}
                            src={"/images/" + item.image}
                            alt={itemName}
                          />{" "}
                          <span>{item.description}</span>
                        </>
                      )}
                      {itemName === "variantName" && (
                        <span>
                          {" "}
                          Цена: {item.price} ₽ | вес: {item.weight}
                        </span>
                      )}
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

export default ItemsList;
