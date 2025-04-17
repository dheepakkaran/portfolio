import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = () => {
  return (
    <Helmet>
      <title>Dk's Portfolio</title>
      <meta name="description" content="Full Stack Developer specializing in modern web technologies and data science" />
      <meta name="keywords" content="full stack developer, web development, react, python, machine learning" />
      <meta property="og:title" content="Dk's Portfolio" />
      <meta property="og:description" content="Full Stack Developer specializing in modern web technologies and data science" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

export default MetaTags;