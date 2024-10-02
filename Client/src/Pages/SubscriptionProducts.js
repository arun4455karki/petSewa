import React, { useState, useEffect, useContext } from 'react';
import ProductList from '../Components/ProductList';
import { PetContext } from '../Context/Context';

export default function SubscriptionProducts() {
  const { fetchSubscription } = useContext(PetContext);
  const [Subscription, setSubscription] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchSubscription();
      setSubscription(products);
    };

    fetchData();
  }, [fetchSubscription]);

  return (
    <>
      <section className="products d-flex flex-column align-items-center mb-5" style={{ paddingTop: '80px' }}>
        <h1 className="mt-5 text-black fw-bolder">
        Subscription
        </h1>
    {Subscription ? <ProductList products={Subscription} /> : <h1>No Inventory</h1>}
       
      </section>
    </>
  );
}
