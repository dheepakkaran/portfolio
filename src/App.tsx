import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import IntroSection from './components/IntroSection';
import ScrollProgress from './components/common/ScrollProgress';
import MetaTags from './components/common/MetaTags';
import SchemaMarkup from './components/common/SchemaMarkup';
import LoadingSpinner from './components/common/LoadingSpinner';
import Footer from './components/Footer';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';

// Lazy load heavier components
const AboutSection = React.lazy(() => import('./components/AboutSection'));
const EducationSection = React.lazy(() => import('./components/EducationSection'));
const ProjectsSection = React.lazy(() => import('./components/ProjectsSection'));

function App() {
  useKeyboardNavigation();

  return (
    <HelmetProvider>
      <MetaTags />
      <SchemaMarkup />
      <ScrollProgress />
      <div className="min-h-screen bg-black">
        <IntroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <AboutSection />
          <EducationSection />
          <ProjectsSection />
        </Suspense>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;