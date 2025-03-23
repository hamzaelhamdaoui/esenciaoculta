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
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform hover:scale-105">
        {/* Imagen del perfume */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 text-white bg-black bg-opacity-40 hover:bg-opacity-70 p-1 rounded-full transition"
            title="Ver producto en la tienda"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Contenido textual */}
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transition-all duration-300"
          >
            Este es el perfume
          </button>
        </div>
      </div>

      {/* Popup de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowConfirm(false)}
            >
              &times;
            </button>
            <img src={image} alt={name} className="w-32 h-32 object-cover mx-auto rounded mb-4 shadow" />
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
            <p className="text-sm text-gray-700 mt-4">
              <strong>⚠️ Solo tienes un intento.</strong><br />¿Estás seguro de que esta es la fragancia?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full"
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
