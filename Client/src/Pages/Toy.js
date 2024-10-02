import React, { useState, useEffect, useContext } from 'react';
import ProductList from '../Components/ProductList';
import { PetContext } from '../Context/Context';

export default function Toy() {
  const { fetchToy } = useContext(PetContext);
  const [Toy, setToy] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchToy();
      setToy(products);
    };

    fetchData();
  }, [fetchToy]);

  return (
    <>
      <section className="products d-flex flex-column align-items-center mb-5" style={{ paddingTop: '80px' }}>
        <h1 className="mt-5 text-black fw-bolder">
           Toys
        </h1>
    {Toy ? <ProductList products={Toy} /> : <h1>No Inventory</h1>}
       
      </section>
    </>
  );
}
