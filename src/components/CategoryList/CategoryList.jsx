import React, { useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import CategoryListItem from "./CategoryListItem";

import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/actions/products";

const CategoryList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const items = useSelector(({ products }) => products.items);

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
                  <td>Доступен</td>
                </tr>
                {items.map((item) => (
                  <CategoryListItem item={item} key={item._id} />
                ))}
              </tbody>
            </Table>
          </blockquote>
        </Card.Body>
      </Card>
    </>
  );
};

export default CategoryList;
