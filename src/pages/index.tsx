import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { getPerfume } from "../api/api";

const Home: React.FC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    const pedido = await getPerfume(orderId.trim());

    // Si no devuelve datos o es objeto vacío
    if (!pedido || typeof pedido !== "object" || Object.keys(pedido).length === 0) {
      setError("Este pedido no existe.");
      return;
    }
    
    if (pedido.attempted) {
      setError("Este pedido ya fue utilizado.");
      if (pedido.success && pedido.discount_code) {
        setDiscountCode(pedido.discount_code);
      }
      return;
    }

    // ✅ El pedido es válido
    router.push(`/guess?order_id=${orderId}`);
  };

  const closePopup = () => {
    setError(null);
    setDiscountCode(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Adivina el Perfume de tu Tarjeta</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg w-full max-w-sm">
        <input
          type="text"
          placeholder="Introduce tu número de pedido"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" text="Buscar Pedido" />
      </form>

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">⚠️ {error}</h2>
            {discountCode && (
              <>
                <p className="text-sm text-gray-700 mb-2">Tu código de descuento es:</p>
                <p className="text-xl font-mono bg-gray-100 px-4 py-2 rounded">{discountCode}</p>
              </>
            )}
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
