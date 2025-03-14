// components/SendPayment.jsx
'use client';
import { ethers } from "ethers";

export default function SendPayment({ onPaymentConfirmed }) {
  const sendPayment = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
      value: ethers.utils.parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
    });

    await tx.wait();

    alert("Pago confirmado, puedes jugar ahora!");
    onPaymentConfirmed(tx.hash);
  };

  return (
    <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={sendPayment}>
      Pagar 0.00001 ETH para jugar
    </button>
  );
}