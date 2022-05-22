import React from "react";
import { Card, Table } from "react-bootstrap";
import ProductListItem from "./ProductListItem";

const ProductsList = ({ selectedCategory, items }) => {
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
                  <td>Доступен</td>
                </tr>

                {items
                  .filter(
                    (category) => category.categoryName === selectedCategory
                  )[0]
                  ?.products.map((product) => (
                    <ProductListItem item={product} key={product._id} />
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
