import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import ItemsList from "../components/ItemsList";
import { fetchCategories } from "../actions/fetchCategories";
import { fetchProductsByCategory } from "../actions/fetchProducts";
import { fetchProductVariants } from "../actions/fetchProductVariants";
import SubmitButton from "../components/SubmitButton";
import { Form, Card } from "react-bootstrap";
import AlertBlock from "../components/AlertBlock";

export const AddVariant = () => {
  const { request, error, loading, clearError } = useHttp();
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [productVariants, setProductVariants] = useState([]);

  const [variantName, setVariantName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const CheckAllErrors = useCallback(async () => {
    if (variantName !== "" && price !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [variantName, price]);

  const Categories = useCallback(async () => {
    const categories = await fetchCategories(token, request);
    if (categories.length !== 0) {
      setCategories(categories);
      setSelectedCategory(categories[0].categoryName);
    }
  }, [token, request]);

  const Products = useCallback(async () => {
    const products = await fetchProductsByCategory(
      token,
      request,
      selectedCategory
    );
    setProducts(products);
    setSelectedProduct(products[0].name);
  }, [token, request, selectedCategory]);

  const ProductVariants = useCallback(async () => {
    const productVariants = await fetchProductVariants(
      token,
      request,
      selectedProduct
    );
    setProductVariants(productVariants);
  }, [token, request, selectedProduct]);

  useEffect(() => {
    Categories();
  }, [Categories]);

  useEffect(() => {
    Products();
  }, [Products]);

  useEffect(() => {
    ProductVariants();
  }, [ProductVariants]);

  useEffect(() => {
    CheckAllErrors();
  }, [CheckAllErrors]);

  useEffect(() => {
    setNoticeError(error);
  }, [error]);

  const categoryHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  const productHandler = (event) => {
    setSelectedProduct(event.target.value);
  };

  const productVariantDelete = async (variantId) => {
    try {
      await request("/api/productVariant/" + variantId, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      ProductVariants();
    } catch (error) {
      console.log(error);
    }
  };

  const submitVariant = async () => {
    try {
      await request(
        "/api/productVariant/add",
        "POST",
        JSON.stringify({
          variantName: variantName,
          price: price,
          weight: weight,
          categoryName: selectedCategory,
          productName: selectedProduct,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (!error && !loading) {
        setNotice("Вариант добавлен");
        setVariantName("");
        setPrice("");
        setWeight("");
        ProductVariants();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertBlock noticeError={noticeError} notice={notice} />
      <Card.Header>
        <h3>Добавление варианта продукта</h3>
      </Card.Header>
      <Card.Body
        onClick={() => {
          clearError();
          setNotice(null);
        }}
      >
        <Form>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Категория</Form.Label>
            <Form.Select onChange={categoryHandler}>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Продукт</Form.Label>
            <Form.Select onChange={productHandler}>
              {products.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name} {}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="addproduct">
            <Form.Label>Название варианта</Form.Label>
            <Form.Control
              type="name"
              placeholder="Введите название варианта"
              value={variantName}
              onChange={(e) => {
                setVariantName(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Цена</Form.Label>
            <Form.Control
              type="name"
              placeholder="Цена, только цифры"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Вес</Form.Label>
            <Form.Control
              type="name"
              value={weight}
              placeholder="Вес, только цифры"
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <SubmitButton
            submitFunc={submitVariant}
            buttonText="Добавить вариант"
            buttonDisabled={buttonDisabled}
          />

          {productVariants.length > 0 && (
            <ItemsList
              items={productVariants}
              itemName="variantName"
              delFunc={productVariantDelete}
            />
          )}
        </Form>
      </Card.Body>
    </>
  );
};
