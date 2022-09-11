import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RestaurantFinder from '../../apis/RestaurantFinder';

const UpdateRestaurant = (props) => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await RestaurantFinder.get(`/${id}`);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);
        }
        fetchData();
    }, [setName, setLocation, setPriceRange]);

    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
            name,
            location,
            price_range: priceRange,
        });
        navigate("/");
    };

    return (
        <div>
            <form action="">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control" id="name" />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input value={location} onChange={e => setLocation(e.target.value)} type="text" className="form-control" id="location" />
                </div>
                <div className="form-group">
                    <label htmlFor="price_range">Price Range</label>
                    <select
                        value={priceRange}
                        onChange={e => setPriceRange(e.target.value)}
                        id="price_range"
                        className='custom-select my-1 mr-sm-2'
                    >
                        <option value="1">$</option>
                        <option value="2">$$</option>
                        <option value="3">$$$</option>
                        <option value="4">$$$$</option>
                        <option value="5">$$$$$</option>
                    </select>
                </div>
                <div className="d-flex justify-content-between">
                    <button onClick={() => navigate("/")} className="btn btn-primary">Back</button>
                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div >
    );
}

export default UpdateRestaurant;