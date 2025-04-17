import { Certification } from './types';

export const certifications: Certification[] = [
  {
    id: '1',
    title: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'Dec 2023',
    description: 'Professional certification for designing distributed systems on AWS.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=crop&w=800&h=400',
    verifyUrl: 'https://aws.amazon.com/verification'
  },
  {
    id: '2',
    title: 'Google Cloud Professional',
    issuer: 'Google Cloud',
    date: 'Nov 2023',
    description: 'Expert-level certification for Google Cloud Platform services.',
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?fit=crop&w=800&h=400',
    verifyUrl: 'https://cloud.google.com/certification'
  },
  {
    id: '3',
    title: 'Meta Frontend Developer',
    issuer: 'Meta',
    date: 'Oct 2023',
    description: 'Advanced certification in modern frontend development practices.',
    image: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?fit=crop&w=800&h=400',
    verifyUrl: 'https://developers.facebook.com/certification'
  }
];