import React from 'react';
import AddRestaurant from '../components/home/AddRestaurant';
import Header from '../components/home/Header';
import RestaurantList from '../components/home/RestaurantList';

const Home = () => {
  return (
    <div>
        <Header />
        <AddRestaurant />
        <RestaurantList />
    </div>
  )
}

export default Home;