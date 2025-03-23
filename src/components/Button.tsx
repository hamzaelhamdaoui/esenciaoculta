interface ButtonProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
  }
  
  const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", disabled }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`mt-4 px-4 py-2 rounded text-white transition ${
          disabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  