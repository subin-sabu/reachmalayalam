import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleClick(event) {
  // event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs({ category , id}) {
  const capitalizedPage = capitalizeFirstLetter(category);
  
  return (
    <div role="presentation" onClick={handleClick} >
      <Breadcrumbs aria-label="breadcrumb" >
        <Link href="/" style={{ color: 'blue', textDecoration: 'none', }}>
          Home
        </Link>
        <Link href={`/${category}`} style={{color: 'blue',  textDecoration: 'none', }}>
          {capitalizedPage}
        </Link>
        <Link href="" style={{color: '#212121',  textDecoration: 'none', }}>
          {id.substring(0,10)}
        </Link>
      </Breadcrumbs>
    </div>
  );
}