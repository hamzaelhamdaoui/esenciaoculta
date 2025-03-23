const ElixartLoader = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-4">
        <img 
          src="/logo-icon.png" 
          alt="Cargando Elixart..." 
          className="absolute w-full h-full opacity-30 animate-fade-in-out" 
        />
      </div>
      <p className="text-gray-600 text-lg font-medium">Cargando...</p>
    </div>
  );
  
  export default ElixartLoader;