import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantFinder from '../../apis/RestaurantFinder';
import { RestaurantsContext } from '../../context/RestaurantsContext';
import StarRating from '../review/StarRating';

const RestaurantList = () => {
    const { restaurants, setRestaurants } = useContext(RestaurantsContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get("/");
                setRestaurants(response.data.data.restaurants);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [setRestaurants]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await RestaurantFinder.delete(`/${id}`);
            setRestaurants(restaurants.filter(restaurant => {
                return restaurant.id !== id;
            }));
        } catch (err) {
            console.log(err);
        }
    }

    let navigate = useNavigate();
    const handleUpdate = (e, id) => {
        e.stopPropagation();
        navigate(`/restaurants/${id}/update`, {replace: true });
    }

    const handleRestaurantSelect = (id) => {
        navigate(`/restaurants/${id}`, {replace: true });
    }

    const renderRating = (restaurant) => {
        if (!restaurant.count) {
            return <span className="text-warning">0 reviews</span>;
        }
        return (
            <>
                <span className="text-warning ml-1">{restaurant.average_rating} </span>
                <StarRating rating={restaurant.average_rating} />
                <span className="text-warning ml-1">({restaurant.count} reviews)</span>
            </>
        );
    };

    return (
        <div className='list-group'>
            <table className="table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope='col'>Restaurant</th>
                        <th scope='col'>Location</th>
                        <th scope='col'>Price Range</th>
                        <th scope='col'>Ratings</th>
                        <th scope='col'>Edit</th>
                        <th scope='col'>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && restaurants.map(restaurant => {
                        return (
                            <tr onClick={() => handleRestaurantSelect(restaurant.id)} key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{"$".repeat(restaurant.price_range)}</td>
                                <td>
                                    {renderRating(restaurant)}
                                </td>
                                <td><button onClick={(e) => handleUpdate(e, restaurant.id)} className='btn btn-warning'>Update</button></td>
                                <td><button onClick={(e) => handleDelete(e, restaurant.id)} className='btn btn-danger'>Delete</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default RestaurantList