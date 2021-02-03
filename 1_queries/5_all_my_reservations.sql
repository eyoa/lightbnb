SELECT res.*, prop.*, AVG(pr.rating) AS "average_rating"
FROM reservations res 
JOIN properties prop ON res.property_id = prop.id
JOIN property_reviews pr ON prop.id = pr.property_id
WHERE res.guest_id = 1 AND res.end_date < Now()::DATE
GROUP BY res.id, prop.id
ORDER BY start_date
LIMIT 10;


-- copy with less info so I can actually see the results
-- SELECT res.id, prop.id, prop.title, prop.cost_per_night, res.start_date, AVG(pr.rating) AS "average_rating"
-- FROM reservations res 
-- JOIN properties prop ON res.property_id = prop.id
-- JOIN property_reviews pr ON prop.id = pr.property_id
-- WHERE res.guest_id = 1 AND res.end_date < Now()::DATE
-- GROUP BY res.id, prop.id
-- ORDER BY start_date
-- LIMIT 10;