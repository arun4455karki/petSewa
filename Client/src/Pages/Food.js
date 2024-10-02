import React, { useState, useEffect, useContext } from 'react';
import ProductList from '../Components/ProductList';
import { PetContext } from '../Context/Context';

export default function Food() {
  const { fetchFood } = useContext(PetContext);
  const [Food, setFood] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchFood();
      setFood(products);
    };

    fetchData();
  }, [fetchFood]);

  return (
    <>
      <section className="products d-flex flex-column align-items-center mb-5" style={{ paddingTop: '80px' }}>
        <h1 className="mt-5 text-black fw-bolder">
           Food
        </h1>

        <ProductList products={Food} />
      </section>
    </>
  );
}
