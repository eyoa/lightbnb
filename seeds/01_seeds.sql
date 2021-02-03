INSERT INTO users (name, email, password)
VALUES ('spongebob', 'pineapple@underthesea.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('link', 'triforce@hyrule.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('mario', 'plummer@pipedream.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Eva', 'Stanley', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties 
(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
 parking_spaces, number_of_bathrooms, number_of_bedrooms,
 country, street, city, province, post_code, active)
 VALUES 
 (1, 'pineapple', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 380, 1, 2, 6,
 'sea floor', 'the one street', 'bikini bottom', 'south sea', '1234', TRUE),
 (2, 'blank corner', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 50, 0, 0, 0,
 'Canada', '3 feet that way', 'Jajaba', 'Nova Scotia', '54232', TRUE),
 (2, 'game house', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 400, 3, 6, 10,
 'Canada', '423 pizza circle', 'that town there', 'Ontario', '87635', TRUE);


 INSERT INTO reservations (start_date, end_date, property_id, guest_id)
 VALUES ('2018-09-11', '2018-09-26', 2, 3),
 ('2019-01-04', '2019-02-01', 2, 2),
 ('2014-10-21', '2014-10-22', 1, 4),
 ('2016-07-14', '2016-07-20', 3, 4);

 INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
 VALUES (3, 2, 1, 1, 'message'),
 (4, 1, 3, 4, 'message'),
 (4, 3, 4, 5, 'message');