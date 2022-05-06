import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Col, Form, Card } from "react-bootstrap";
import ProductsList from "../components/ProductsList";
import { fetchCategories } from "../actions/fetchCategories";
import { fetchProductsByCategory } from "../actions/fetchProducts";
import { transliterate } from "../actions/transliterate";
import SubmitButton from "../components/SubmitButton";
import AlertBlock from "../components/AlertBlock";

export const AddProduct = () => {
  const { request, loading, error, clearError } = useHttp();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const inputRef = useRef();

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
  }, [token, request, selectedCategory]);

  const CheckAllErrors = useCallback(async () => {
    if ((name !== "") & (img !== null) && selectedCategory !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, img, selectedCategory]);

  const productDelete = async (productId) => {
    try {
      await request("/api/product/" + productId, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      Products();
    } catch (error) {
      console.log(error);
    }
  };

  const categoryHandler = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    setNoticeError(error);
  }, [error]);

  useEffect(() => {
    Categories();
  }, [Categories]);

  useEffect(() => {
    Products();
  }, [Products]);

  useEffect(() => {
    CheckAllErrors();
  }, [CheckAllErrors]);

  const submitProduct = async () => {
    try {
      const imgFormData = new FormData();

      const selectedCategoryTranslit = transliterate(selectedCategory);

      const fileName = img.name.split(".")[0].replace(/ /g, "-");
      const fileExt = img.name.split(".").pop();
      const fileNameTranslit = transliterate(fileName);

      imgFormData.append("image", img);
      imgFormData.append("categoryName", selectedCategoryTranslit);
      imgFormData.append("fileNameTranslit", fileNameTranslit);
      imgFormData.append("uploadSecret", "Bdsfjhsfdkjfsd");

      await request("/api/uploadImage", "POST", imgFormData, {
        headres: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!loading && !error) {
        await request(
          "/api/product/add",
          "POST",
          JSON.stringify({
            name: name,
            description: description,
            categoryName: selectedCategory,
            image:
              selectedCategoryTranslit + "/" + fileNameTranslit + "." + fileExt,
          }),

          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );

        Products();
        setName("");
        setImg(null);
        setDescription("");
        inputRef.current.value = null;
        setNotice("Продукт добавлен");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertBlock noticeError={noticeError} notice={notice} />
      <Card.Header>
        <h3>Добавление продукта</h3>
      </Card.Header>
      <Card.Body
        onClick={() => {
          clearError();
          setNotice(null);
        }}
      >
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

        <Form.Group className="mb-3" controlId="addproduct">
          <Form.Label>Название</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите название продукта"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            placeholder="Введите описание продукта"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Выберите файл изображения</Form.Label>
          <Form.Control
            type="file"
            placeholder="Файл"
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
            ref={inputRef}
          />
        </Form.Group>

        <Form.Group as={Col} md="6">
          <SubmitButton
            submitFunc={submitProduct}
            buttonText="Добавить продукт"
            buttonDisabled={buttonDisabled}
          />
        </Form.Group>
        {products.length > 0 && (
          <ProductsList
            type="product"
            items={products}
            setItems={setProducts}
            delFunc={productDelete}
            token={token}
          />
        )}
      </Card.Body>
    </>
  );
};
