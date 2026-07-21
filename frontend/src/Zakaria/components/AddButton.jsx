const AddButton = ({ onClick, text, filtre }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div>{filtre}</div>
      <button
        type="button"
        onClick={onClick}
        style={{
          border: "none",
          borderRadius: "999px",
          backgroundColor: "#2c767c",
          color: "#ffffff",
          padding: "10px 18px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default AddButton;
