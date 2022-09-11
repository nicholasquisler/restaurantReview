import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import AddReview from '../components/review/AddReview';
import Reviews from '../components/review/Reviews';
import StarRating from '../components/review/StarRating';
import { RestaurantsContext } from '../context/RestaurantsContext';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        setSelectedRestaurant(response.data.data);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [setSelectedRestaurant]);

  return (
    <div>{selectedRestaurant && (
      <>
        <h1 className="text-center display-1" >
          {selectedRestaurant.restaurant.name}
        </h1>
        <div className="text-center display-1" style={{fontSizeAdjust: "0.2", marginTop: "-30px"}}>
          <span className="text-warning">{selectedRestaurant.restaurant.average_rating} </span>
          <StarRating rating={selectedRestaurant.restaurant.average_rating} />
          <span className="text-warning">
            {selectedRestaurant.restaurant.count
              ? `(${selectedRestaurant.restaurant.count} reviews)`
              : "(0 reviews)"}
          </span>
        </div>
        <div className="mt-3">
          <Reviews reviews={selectedRestaurant.reviews} />
        </div>
        <AddReview />
      </>
    )
    }
    </div>
  );
}

export default RestaurantDetailPage