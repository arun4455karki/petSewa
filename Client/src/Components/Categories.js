import React, { useContext } from 'react';
import { PetContext } from '../Context/Context';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { categories } from '../Pages/dummyData';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../Styles/Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const { selectedPetType, selectPetType } = useContext(PetContext);

  // Function to handle pet type selection
  const handlePetTypeSelect = (petType) => {
    selectPetType(petType);  // Update the selected pet type in context
    toast.success(`Selected Pet Type: ${petType}`);  // Display a toast notification
  };

  return (
    <section className="categories d-flex flex-column align-items-center mb-5">
      <h1 className="mb-5 text-black fw-bolder">
        Categories
      </h1>
      <div className="row d-flex justify-content-center align-items-center gap-3 g-0 flex-wrap">

        {/* Pet Type Dropdown */}
        <MDBDropdown>
          <MDBDropdownToggle color="secondary"><h6><b>Choose Your Pet-Type: {selectedPetType || 'Select'}</b></h6></MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem link onClick={() => handlePetTypeSelect('dog')}>Dog</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handlePetTypeSelect('cat')}>Cat</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => handlePetTypeSelect('bird')}>Bird</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>

        {/* Categories List */}
        {categories.map((category, index) => (
          <div
            className="col"
            key={index}
            onClick={() => (category.path ? navigate(category.path) : toast('Coming soon...'))}
          >
            <img src={category.imageUrl} alt={category.name} />
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
