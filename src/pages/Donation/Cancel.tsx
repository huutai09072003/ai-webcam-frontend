import React from 'react';

import { Link } from 'react-router-dom';

const Cancel: React.FC = () => (
  <div>
    <h1>Donation Cancelled</h1>
    <p>You have cancelled your donation. <Link to="/">Try again</Link>.</p>
  </div>
);

export default Cancel;