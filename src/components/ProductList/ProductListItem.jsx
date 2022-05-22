import useInput from "../../hooks/useInput";
import { CloseButton, Form } from "react-bootstrap";

export default function ProductsListItem({ item }) {
  const name = useInput(item.name, item._id, "name", "product");
  const description = useInput(
    item.description,
    item._id,
    "description",
    "product"
  );

  const visible = useInput(item.visible, item._id, "visible", "product");
  return (
    <tr key={item._id}>
      <td key={item._id}>
        <CloseButton
          id={item._id}
          key={item._id}
          value={item.name}
          onClick={name.props.onDelete}
        />
      </td>
      <td>
        <Form.Control
          value={name.value}
          onChange={(event) => {
            name.props.onChange(event.target.value, "name", item._id);
          }}
        />
        {name.loading && <>Loading...</>}
      </td>

      <td>
        <Form.Control
          as="textarea"
          value={description.value}
          rows={3}
          onChange={(event) => {
            description.props.onChange(
              event.target.value,
              "description",
              item._id
            );
          }}
        />
        {description.loading && <>Loading...</>}
      </td>

      <td>
        <img
          style={{ height: "100px" }}
          src={"/images/" + item.image}
          alt={item.name}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={visible.value}
          onChange={(event) => {
            visible.props.onChange(event.target.checked, "visible", item._id);
          }}
        />
        {visible.loading && <>Loading...</>}
      </td>
    </tr>
  );
}
