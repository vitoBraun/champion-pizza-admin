import useInput from "../../hooks/useInput";
import { CloseButton, Form } from "react-bootstrap";

export default function CategoryListItem({ item }) {
  const categoryName = useInput(
    item.categoryName,
    item._id,
    "categoryName",
    "category"
  );
  const visible = useInput(item.visible, item._id, "visible", "category");

  return (
    <tr key={item._id}>
      <td key={item._id}>
        <CloseButton
          id={item._id}
          key={item._id}
          value={item.name}
          onClick={categoryName.props.onDelete}
        />
      </td>
      <td>
        <Form.Control
          value={categoryName.value}
          onChange={(event) => {
            categoryName.props.onChange(event.target.value, "name", item._id);
          }}
        />
        {categoryName.loading && <>Loading...</>}
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
