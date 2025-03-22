'use client';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  defs,
} from 'recharts';
import supabase from '@/lib/supabaseClient';

export default function TokenChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tokenData, error } = await supabase
        .from('token_value_timeseries')
        .select('*')
        .order('hour', { ascending: true });

      if (error) {
        console.error('Error fetching token chart data:', error);
        return;
      }

      if (!tokenData || tokenData.length === 0) {
        setData([]);
        return;
      }

      const filledData = [];
      const startTime = new Date(tokenData[0].hour);
      const endTime = new Date(tokenData[tokenData.length - 1].hour);
      let currentTime = new Date(startTime);
      let currentValue = parseFloat(tokenData[0].cumulative_reward);
      let index = 0;

      while (currentTime <= endTime) {
        if (
          index < tokenData.length &&
          new Date(tokenData[index].hour).getTime() === currentTime.getTime()
        ) {
          currentValue = parseFloat(tokenData[index].cumulative_reward);
          index++;
        }

        filledData.push({
          time: currentTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }),
          value: currentValue,
        });

        currentTime = new Date(currentTime.getTime() + 3600 * 1000);
      }

      setData(filledData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full mt-10 bg-gray-900 p-4 rounded-xl shadow-lg">

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              tick={{ fill: '#ccc', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(val) => `${val} ETH`}
              tick={{ fill: '#ccc', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
              labelStyle={{ color: '#a3e635' }}
              formatter={(value) => [`${value} ETH`, 'Valor']}
              labelFormatter={(label) => `Hora: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorEth)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-sm text-gray-400">No data to display.</p>
      )}
    </div>
  );
}
