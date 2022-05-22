import useInput from "../../hooks/useInput";
import { CloseButton, Form } from "react-bootstrap";

export default function ProductsListItem({ item }) {
  const variantName = useInput(
    item.variantName,
    item._id,
    "variantName",
    "variant"
  );

  const price = useInput(item.price, item._id, "price", "variant");
  const weight = useInput(item.weight, item._id, "weight", "variant");

  const visible = useInput(item.visible, item._id, "visible", "variant");
  return (
    <tr key={item._id}>
      <td key={item._id}>
        <CloseButton
          id={item._id}
          key={item._id}
          value={item.name}
          onClick={variantName.props.onDelete}
        />
      </td>
      <td>
        <Form.Control
          value={variantName.value}
          onChange={(event) => {
            variantName.props.onChange(
              event.target.value,
              "variantName",
              item._id
            );
          }}
        />
        {variantName.loading && <>Loading...</>}
      </td>

      <td>
        <Form.Control
          value={price.value}
          onChange={(event) => {
            price.props.onChange(event.target.value, "variantName", item._id);
          }}
        />
        {price.loading && <>Loading...</>}
      </td>
      <td>
        <Form.Control
          value={weight.value}
          onChange={(event) => {
            weight.props.onChange(event.target.value, "weight", item._id);
          }}
        />
        {weight.loading && <>Loading...</>}
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
