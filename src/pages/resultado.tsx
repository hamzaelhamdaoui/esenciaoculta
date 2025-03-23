import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPerfume, validateGuess } from "../api/api";
import Loader from "../components/Loader"; // mismo loader con el logo de Elixart

const Resultado: React.FC = () => {
  const router = useRouter();
  const { order_id, guessed_perfume_name } = router.query;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ correct: boolean; discount_code?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order_id || !guessed_perfume_name) return;

    const validarIntento = async () => {
      try {
        const pedido = await getPerfume(order_id as string);

        // 🚫 Si ya intentó, bloquear
        if (pedido?.attempted) {
          setError("Este pedido ya ha sido utilizado.");
          setLoading(false);
          return;
        }

        const resultado = await validateGuess(order_id as string, guessed_perfume_name as string);
        setResult(resultado);
      } catch (e) {
        setError("Ha ocurrido un error al validar tu respuesta.");
      } finally {
        setLoading(false);
      }
    };

    validarIntento();
  }, [order_id, guessed_perfume_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ {error}</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      {result?.correct ? (
  <div className="flex flex-col items-center justify-center text-center px-4">
    {/* Logo animado */}
    <img
      src="/logo-icon.png"
      alt="Elixart Logo"
      className="w-20 mb-4 opacity-90 animate-fade-in-out"
    />

    {/* Título destacado */}
    <h1 className="text-4xl font-extrabold text-yellow-500 mb-2">
      ¡Has acertado! 🎉
    </h1>

    {/* Mensaje principal */}
    <p className="text-gray-800 text-lg max-w-md mb-6">
      Tu nariz no falla... <strong>¡has descubierto la fragancia secreta!</strong>
    </p>

    {/* Descripción del premio */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-inner px-6 py-5 text-gray-700 max-w-md w-full mb-6">
      <h2 className="text-lg font-semibold mb-2">🎁 Premio:</h2>
      <p>
        Has ganado un <strong className="text-yellow-600">30% de descuento</strong> exclusivo en tu próxima compra.
      </p>
      <p className="text-sm mt-1 text-gray-500">Sin caducidad · Uso único</p>
    </div>

    {/* Código de descuento */}
    <div className="bg-white rounded-lg px-6 py-4 shadow-lg border border-gray-300">
      <p className="text-gray-700 font-medium text-sm mb-1">Tu código de descuento es:</p>
      <p className="text-2xl font-mono tracking-wider bg-gray-100 px-6 py-2 rounded">
        {result.discount_code}
      </p>
    </div>

    {/* CTA hacia la tienda */}
    <a
      href="https://elixartparfums.com"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transition-all duration-300"
    >
      Ir a la tienda
    </a>

    {/* Info extra */}
    <p className="text-gray-500 text-sm mt-3">
      Podrás aplicar tu código durante el proceso de pago en{" "}
      <a
        href="https://elixartparfums.com"
        className="text-yellow-500 hover:underline"
        target="_blank"
      >
        elixartparfums.com
      </a>
    </p>
  </div>
) : (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
          <img src="/logo-icon.png" alt="Elixart Logo" className="w-20 mb-6 opacity-70" />
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">¡Incorrecto! 😔</h1>
          <p className="text-gray-700 text-base max-w-md">
            Ese no era el perfume utilizado para perfumar tu tarjeta. Solo tienes una oportunidad.
          </p>
          <p className="text-sm text-gray-500 mt-4 mb-4">
            Pero no te preocupes, ¡tenemos un regalo para ti! 
          </p>
    
          {/* Código de consuelo */}
          <div className="bg-gray-100 rounded-lg px-6 py-4 shadow-md mb-6">
            <p className="text-gray-700 font-medium text-sm mb-1">Tu código de descuento del 10% es:</p>
            <p className="text-xl font-mono bg-white px-4 py-2 rounded border border-gray-300">
              PRIMERPEDIDO10
            </p>
          </div>
    
          <a
            href="https://elixartparfums.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transition-all duration-300"
          >
            Descubrir perfumes
          </a>
        </div>
      )}
    </div>
  );
};

export default Resultado;
