import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableProductRow = ({
  product,
  onView,
  onEdit,
  onDelete,
  onVisibility,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#fafafa" : "",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {/* Drag Handle */}
      <td
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          fontSize: "18px",
          width: "20px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        ☰
      </td>

      <td>
  <img
  src={product.images?.[0]}
  alt={product.name}
  style={{
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
    display: "block",
  }}
/>
      </td>

      <td>{product.name}</td>

      <td>₹{product.originalPrice}</td>

      <td>₹{product.discountPrice}</td>

      <td>{product.stock}</td>

      <td>
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => onView(product)}
          >
            View
          </button>

          <button
            className="view-btn"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            className={
              product.isVisible
                ? "view-btn danger"
                : "view-btn"
            }
            onClick={() =>
              onVisibility(product._id)
            }
          >
            {product.isVisible ? "Hide" : "Publish"}
          </button>

          <button
            className="view-btn danger"
            onClick={() =>
              onDelete(product._id)
            }
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SortableProductRow;