import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPerfume, validateGuess } from "../api/api";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <p className="text-lg text-gray-600">Comprobando tu respuesta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">⚠️ {error}</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      {result?.correct ? (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-2">¡Correcto! 🎉</h1>
          <p className="text-lg">Tu código de descuento es:</p>
          <p className="text-2xl font-mono mt-2 bg-gray-200 px-4 py-2 rounded">
            {result.discount_code}
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-500 mb-2">¡Incorrecto! 😔</h1>
          <p className="text-lg">Ese no fue el perfume usado. No puedes volver a intentarlo.</p>
        </>
      )}
    </div>
  );
};

export default Resultado;
