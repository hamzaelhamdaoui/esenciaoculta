const API_GET_PERFUME = "https://getperfumefororder-598233774086.europe-southwest1.run.app";
const API_VALIDATE_GUESS = "https://validateguess-598233774086.europe-southwest1.run.app";

export async function getPerfume(orderId: string) {
  const res = await fetch(`${API_GET_PERFUME}?order_id=${orderId}`);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}


export async function validateGuess(orderId: string, guessedPerfumeName: string) {
  const res = await fetch(API_VALIDATE_GUESS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, guessed_perfume_id: guessedPerfumeName }),
  });
  return res.json();
}

export async function getAllPerfumes() {
  const res = await fetch("https://getallperfumes-598233774086.europe-southwest1.run.app");
  const data = await res.json();
  return data.perfumes;
}
