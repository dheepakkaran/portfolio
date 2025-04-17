import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateSchema } from '../../utils/schema';

const SchemaMarkup = () => {
  const schema = generateSchema({
    name: 'John Doe',
    role: 'Full Stack Developer',
    description: 'Full Stack Developer specializing in modern web technologies and data science',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    projects: []
  });

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;