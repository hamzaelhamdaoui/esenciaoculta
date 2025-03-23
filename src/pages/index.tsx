import { useState } from "react";
import { useRouter } from "next/router";
import { getPerfume } from "../api/api";

const Home: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
  
    const pedido = await getPerfume(orderId.trim());
  
    // Si el pedido no existe (devuelve null o vacío)
    if (!pedido || typeof pedido !== "object" || Object.keys(pedido).length === 0) {
      setError("not_found");
      return;
    }
  
    if (pedido.attempted) {
      setError("used");
      if (pedido.success && pedido.discount_code) {
        setDiscountCode(pedido.discount_code); // Acertó
      }
      return;
    }
  
    router.push(`/guess?order_id=${orderId}`);
  };  

  const closePopup = () => {
    setError(null);
    setDiscountCode(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-8">
      {/* Header */}
      <header className="w-full flex items-center justify-between mb-8 max-w-3xl">
        <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Elixart Parfums" className="w-28" />
        </a>
        <nav>
          <ul className="flex gap-6 text-sm font-medium text-gray-700">
            <li>
              <a href="https://elixartparfums.com" target="_blank" className="hover:text-yellow-500 transition">Tienda</a>
            </li>
            <li>
              <a href="https://elixartparfums.com/pages/contact" target="_blank" className="hover:text-yellow-500 transition">Contáctanos</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="text-center max-w-md w-full bg-white shadow-xl p-6 rounded-xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-snug">
          ¿Puedes adivinar qué <span className="text-yellow-500">perfume usamos</span>?
        </h1>
        <p className="text-gray-600 mb-6 text-base">
          Hemos perfumado tu tarjeta de agradecimiento con una de nuestras fragancias.
          Si adivinas cuál, <strong>¡te damos un 30% de descuento</strong> en tu próxima compra!
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Introduce tu número de pedido"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105"
          >
            ¡Empezar juego!
          </button>
        </form>
      </main>

      {/* Popup */}
      {error && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
      <img src="/logo-icon.png" alt="Elixart Logo" className="w-16 mx-auto mb-4 opacity-80" />
      
      {/* 🟥 Pedido NO existe */}
      {error === "not_found" ? (
        <>
          <h2 className="text-xl font-extrabold text-red-600 mb-2">Pedido no encontrado</h2>
          <p className="text-gray-700 text-base mb-4">
            El número de pedido que introdujiste no existe o no es válido.
          </p>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Verifica que estés copiando correctamente el número de pedido desde el email o SMS que recibiste.
            <br />
            Introduce <strong>solo los números</strong>, sin el símbolo # ni otros caracteres.
          </p>
          <button
            onClick={closePopup}
            className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
          >
            Volver a intentar
          </button>
        </>
      ) : (
        <>
          {/* 🟡 Pedido YA usado */}
          <h2 className="text-xl font-extrabold text-red-600 mb-2">
            Este pedido ya fue utilizado
          </h2>

          {discountCode ? (
            <>
              <p className="text-gray-700 text-base mb-2">
                ¡Y acertaste! Aquí tienes tu recompensa:
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner px-6 py-4 mb-4">
                <p className="text-gray-700 font-medium text-sm mb-1">Tu código de descuento del 30%:</p>
                <p className="text-xl font-mono bg-white px-4 py-2 rounded border border-gray-300">
                  {discountCode}
                </p>
                <p className="text-sm text-gray-500 mt-1">Uso único · Sin caducidad</p>
              </div>

              <a
                href="https://elixartparfums.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:from-yellow-500 hover:to-yellow-600 transition mb-2"
              >
                Usar código en tienda
              </a>
            </>
          ) : (
            <>
              <p className="text-gray-700 text-base mb-4">
                El juego ya fue intentado. Aunque no acertaste, no te vas con las manos vacías.
              </p>

              <div className="bg-gray-100 rounded-lg px-6 py-4 shadow-md mb-4">
                <p className="text-gray-700 font-medium text-sm mb-1">Tu código de descuento del 10%:</p>
                <p className="text-xl font-mono bg-white px-4 py-2 rounded border border-gray-300">
                  PRIMERPEDIDO10
                </p>
                <p className="text-sm text-gray-500 mt-1">Solo para tu primera compra</p>
              </div>

              <a
                href="https://elixartparfums.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:from-yellow-500 hover:to-yellow-600 transition mb-2"
              >
                Explorar perfumes
              </a>
            </>
          )}

          <button
            onClick={closePopup}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
          >
            Volver a intentar
          </button>
        </>
      )}
    </div>
  </div>
)}

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-8">
        © 2024 Elixart Parfums. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
