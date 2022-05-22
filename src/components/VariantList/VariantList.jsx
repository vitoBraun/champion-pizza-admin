import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import VariantListItem from "./VariantListItem";
// import { fetchProducts } from "../../redux/actions/products";
// import { useDispatch, useSelector } from "react-redux";

const VariantList = ({ selectedCategory, selectedProduct, items }) => {
  // const [variants, setVariants] = useState([]);
  // const [products, setProducts] = useState([]);

  // const items = useSelector(({ products }) => products.items);

  const categories = items.filter(
    (category) => category.categoryName === selectedCategory
  );

  const products = categories[0]?.products;
  const variants = products?.filter(
    (product) => product?.name === selectedProduct
  )[0]?.variants;

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
                  <td>Цена</td>
                  <td>Вес</td>
                  <td>Доступен</td>
                </tr>
                {variants &&
                  variants.length > 0 &&
                  variants.map((item) => (
                    <VariantListItem item={item} key={item._id} />
                  ))}
              </tbody>
            </Table>
          </blockquote>
        </Card.Body>
      </Card>
    </>
  );
};

export default VariantList;
