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
import ProductList from "../components/ProductList/ProductList";
import { transliterate } from "../actions/transliterate";
import SubmitButton from "../components/SubmitButton";
import AlertBlock from "../components/AlertBlock";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/actions/products";

export const AddProduct = () => {
  const { request, loading, error, clearError } = useHttp();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);

  const isLoaded = useSelector(({ products }) => products.isLoaded);
  const items = useSelector(({ products }) => products.items);

  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory")
      ? localStorage.getItem("selectedCategory")
      : ""
  );

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const inputRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  });

  const saveSelectedCategory = useCallback((categoryName) => {
    setSelectedCategory(categoryName);
    localStorage.setItem("selectedCategory", categoryName);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setSelectedCategory(
        localStorage.getItem("selectedCategory")
          ? localStorage.getItem("selectedCategory")
          : items[0]?.categoryName
      );
    }
  }, [isLoaded, items]);

  const CheckAllErrors = useCallback(async () => {
    if ((name !== "") & (img !== null) && selectedCategory !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, img, selectedCategory]);

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

      await request("/api/uploadimage", "POST", imgFormData, {
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

        dispatch(fetchProducts());
        setName("");
        setImg(null);
        setDescription("");
        inputRef.current.value = null;
        setNotice("Продукт добавлен");
      }
    } catch (error) {
      console.log(error);
      setNoticeError(error);
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
          <Form.Select
            onChange={(e) => {
              saveSelectedCategory(e.target.value);
              // setSelectedCategory(e.target.value);
            }}
            value={selectedCategory}
          >
            {items.map((category) => (
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
        <ProductList selectedCategory={selectedCategory} items={items} />
      </Card.Body>
    </>
  );
};
