import { useRouter } from "next/router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface CardProps {
  name: string;
  image: string;
  url: string;
  id: string;
  orderId: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, image, url, id, orderId, description }) => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    router.push(`/resultado?order_id=${orderId}&guessed_perfume_name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <div className="border rounded-lg shadow-md bg-white p-4 flex flex-col items-center text-center relative">
        <img src={image} alt={name} className="w-full h-40 object-cover rounded mb-2" />
        <h2 className="font-semibold text-base mb-1">{name}</h2>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
          title="Ver producto en la web"
        >
          <ExternalLink size={18} />
        </a>

        <button
          onClick={() => setShowConfirm(true)}
          className="mt-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
        >
          Este es el perfume
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowConfirm(false)}
            >
              &times;
            </button>
            <img src={image} alt={name} className="w-40 h-40 object-cover mx-auto rounded mb-4" />
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <h4 className="text-m font-regular mb-2">{description}</h4>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Solo tienes un intento.</strong> ¿Estás seguro de que este es el perfume?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
