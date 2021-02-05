$(() => {
  getAllListings().then(function( json ) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');

    $('.reservationForm').on('submit', function (event) {
      event.preventDefault();
      const data = $(this).serialize();
      submitReservation(data)
      .then(() => {
        propertyListings.clearListings();
        getAllReservations()
          .then(function(json) {
            propertyListings.addProperties(json.reservations, true);
            views_manager.show('listings');
          })
          .catch(error => console.error(error));
      })
      .catch((error) => {
        console.error(error);
        views_manager.show('listings');
      })
    
    });
    
  });
});