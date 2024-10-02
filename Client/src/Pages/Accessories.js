import React, { useState, useEffect, useContext } from 'react';
import ProductList from '../Components/ProductList';
import { PetContext } from '../Context/Context';

export default function Accessories() {
  const { fetchAccessories } = useContext(PetContext);
  const [Accessories, setAccessories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchAccessories();
      setAccessories(products);
    };

    fetchData();
  }, [fetchAccessories]);

  return (
    <>
      <section className="products d-flex flex-column align-items-center mb-5" style={{ paddingTop: '80px' }}>
        <h1 className="mt-5 text-black fw-bolder">
        Accessories
        </h1>

        {Accessories ? <ProductList products={Accessories} /> : <h1>No Inventory</h1>}
      </section>
    </>
  );
}
