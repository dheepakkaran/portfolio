export const generateSchema = (data: {
  name: string;
  role: string;
  description: string;
  image: string;
  projects: any[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.role,
    description: data.description,
    image: data.image,
    url: window.location.origin,
    sameAs: [
      'https://github.com',
      'https://linkedin.com',
      'https://twitter.com'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Self-Employed'
    },
    knowsAbout: [
      'Machine Learning',
      'Deep Learning',
      'Python',
      'Data Science',
      'Web Development'
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Stanford University'
    }
  };
};