'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('wallet, total_eth')
        .order('total_eth', { ascending: false });

      if (error) {
        console.error("Error loading leaderboard:", error);
        setLeaderboard([]);
      } else {
        setLeaderboard(data);
      }
    };

    fetchLeaderboard();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center">Top Contributors</h2>
      <table className="w-full mt-4 border border-white">
        <thead>
          <tr>
            <th className="border border-white px-4 py-2">Wallet</th>
            <th className="border border-white px-4 py-2">ETH</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((entry, index) => (
              <tr key={index}>
                <td className="border border-white px-4 py-2 font-mono break-all">
                  {entry.wallet}
                </td>
                <td className="border border-white px-4 py-2 font-mono text-right">
                {entry.total_eth}
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="border border-white px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(leaderboard.length / itemsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 border border-white ${
              currentPage === i + 1 ? "bg-white text-black" : "text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
