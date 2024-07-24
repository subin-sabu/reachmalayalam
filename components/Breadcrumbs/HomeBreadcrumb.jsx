import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';



function handleClick(event) {
  event.preventDefault();

}

export default function HomeBreadcrumbs({ category }) {


  return (
    <div role="presentation" onClick={handleClick} style={{paddingBottom:'0.4rem'}}>
      <Breadcrumbs aria-label="breadcrumb" >
        <Link href="/" style={{ color: '#212121', textDecoration: 'none', }}>
          Home
        </Link>
      </Breadcrumbs>
    </div>
  );
}