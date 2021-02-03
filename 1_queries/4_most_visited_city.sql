SELECT prop.city, COUNT(res.*) AS "total_reservations"
FROM reservations res 
JOIN properties prop ON res.property_id = prop.id
GROUP BY prop.city
ORDER BY total_reservations DESC;