import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAllPerfumes, getPerfume } from "../api/api";
import Card from "../components/Card";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Selecciona el perfume</h1>

      {loading ? (
        <p className="text-gray-700 text-lg">Cargando perfumes...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

      {pedidoYaUsado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">Este pedido ya se ha intentado</h2>
            {correcto && codigo ? (
              <>
                <p className="text-gray-700 mb-4">¡Y acertaste! 🎉</p>
                <p className="text-sm">Tu código de descuento es:</p>
                <p className="text-xl font-mono bg-gray-100 rounded py-2 px-4 mt-2">{codigo}</p>
              </>
            ) : (
              <p className="text-gray-700 mb-4">No puedes volver a intentarlo.</p>
            )}
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guess;
