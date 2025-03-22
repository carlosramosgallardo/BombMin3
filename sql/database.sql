CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL,
  problem TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_ms INTEGER NOT NULL,
  mining_reward NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE VIEW leaderboard AS
SELECT
  wallet,
  SUM(mining_reward) AS total_eth
FROM games
WHERE is_correct = TRUE
GROUP BY wallet
ORDER BY total_eth DESC;
create view public.token_value as
select
  sum(games.mining_reward) as total_eth
from
  games
where
  games.is_correct = true;
CREATE OR REPLACE VIEW token_value_timeseries AS
WITH hour_series AS (
  -- 1. Generamos cada hora desde la primera creación hasta la hora actual
  SELECT generate_series(
    date_trunc('hour', (SELECT MIN(created_at) FROM games)), 
    date_trunc('hour', NOW()), 
    interval '1 hour'
  ) AS hour
),
hour_rewards AS (
  -- 2. Sumar recompensas por hora (sólo donde is_correct = TRUE)
  SELECT
    date_trunc('hour', created_at) AS hour,
    SUM(mining_reward) AS total_hour
  FROM games
  WHERE is_correct = TRUE
  GROUP BY date_trunc('hour', created_at)
),
final AS (
  -- 3. Combinar con LEFT JOIN para “rellenar” horas sin datos con 0
  SELECT
    hs.hour,
    COALESCE(hr.total_hour, 0) AS hourly_reward
  FROM hour_series hs
  LEFT JOIN hour_rewards hr ON hr.hour = hs.hour
)
SELECT
  hour,
  SUM(hourly_reward) OVER (ORDER BY hour ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_reward
FROM final
ORDER BY hour;