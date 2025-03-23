import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAllPerfumes, getPerfume } from "../api/api";
import Card from "../components/Card";
import ElixartLoader from "@/components/Loader";

interface Perfume {
  id: string;
  title: string;
  image: string;
  url: string;
  description: string;
}

const Guess: React.FC = () => {
  const router = useRouter();
  const { order_id } = router.query;

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [pedidoYaUsado, setPedidoYaUsado] = useState(false);
  const [correcto, setCorrecto] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!order_id) return;

    const checkOrderStatus = async () => {
      setLoading(true);
      const pedido = await getPerfume(order_id as string);
      const lista = await getAllPerfumes();

      setPerfumes(lista || []);

      if (pedido?.attempted) {
        setPedidoYaUsado(true);
        if (pedido.success && pedido.discount_code) {
          setCorrecto(true);
          setCodigo(pedido.discount_code);
        }
      }

      setLoading(false);
    };

    checkOrderStatus();
  }, [order_id]);

  const closePopup = () => {
    setPedidoYaUsado(false);
    router.push("/"); // redirige al home
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center px-4 py-8">
      {/* Header */}
      <header className="w-full flex items-center justify-between mb-6 max-w-4xl">
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

      <main className="w-full max-w-6xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          ¿Cuál fue la <span className="text-yellow-500">esencia oculta</span> en tu tarjeta?
        </h1>
        <p className="text-gray-600 mb-8 text-base max-w-2xl mx-auto">
          Elige entre nuestros perfumes. Si aciertas el que perfumó tu tarjeta, ¡ganas un <strong>30% de descuento</strong> en tu próxima compra! Solo tienes <strong>una oportunidad</strong>.
        </p>

        {loading ? (
          <ElixartLoader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {perfumes.map((perfume) => (
              <Card
                key={perfume.id}
                id={perfume.id}
                name={perfume.title}
                image={perfume.image}
                url={perfume.url}
                orderId={order_id as string}
                description={perfume.description}
              />
            ))}
          </div>
        )}
      </main>

      {/* Si ya intentó */}
      {pedidoYaUsado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Este pedido ya fue usado</h2>
            {correcto && codigo ? (
              <>
                <p className="text-gray-700 mb-2">¡Y acertaste! 🥳</p>
                <p className="text-sm text-gray-600">Tu código de descuento exclusivo:</p>
                <p className="text-2xl font-mono bg-gray-100 px-6 py-2 rounded mt-2">{codigo}</p>
              </>
            ) : (
              <p className="text-gray-600">No puedes volver a intentarlo.</p>
            )}
            <button
              onClick={closePopup}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
            >
              Volver al inicio
            </button>
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

export default Guess;
