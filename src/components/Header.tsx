interface HeaderProps {
    title: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ title }) => {
    return <h1 className="text-2xl font-bold mb-4">{title}</h1>;
  };
  
  export default Header;
  