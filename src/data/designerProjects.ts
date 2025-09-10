export interface DesignerProject {
  id: string;
  title: string;
  type: 'ready-design' | 'past-project';
  designer: string;
  description: string;
  image: string;
  year: string;
  category: string;
  price?: number; // Only for ready designs
  currency?: string;
  location?: string; // For past projects
  client?: string; // For past projects
  features?: string[]; // For ready designs
  tags: string[];
}

export const designerProjects: DesignerProject[] = [
  // Frank Chou Projects
  {
    id: 'frank_ready_1',
    title: 'Zen Harmony Living Room',
    type: 'ready-design',
    designer: 'Frank Chou',
    description: 'A complete living room design blending Eastern minimalism with contemporary luxury',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2024',
    category: 'Living Room',
    price: 28500,
    currency: 'AED',
    features: [
      'Custom sectional sofa with silk upholstery',
      'Hand-carved coffee table in walnut',
      'Coordinated lighting scheme',
      'Feng shui arrangement consultation',
      'Premium textile selection'
    ],
    tags: ['Contemporary', 'Eastern Aesthetics', 'Luxury', 'Complete Room']
  },
  {
    id: 'frank_ready_2',
    title: 'Executive Zen Office',
    type: 'ready-design',
    designer: 'Frank Chou',
    description: 'Sophisticated office design promoting productivity and tranquility',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2024',
    category: 'Office',
    price: 18900,
    currency: 'AED',
    features: [
      'Ergonomic executive desk in bamboo',
      'Meditation corner setup',
      'Natural lighting optimization',
      'Storage solutions with hidden compartments',
      'Air purifying plant arrangement'
    ],
    tags: ['Office', 'Productivity', 'Wellness', 'Contemporary']
  },
  {
    id: 'frank_past_1',
    title: 'Four Seasons Resort Dubai Lobby',
    type: 'past-project',
    designer: 'Frank Chou',
    description: 'Luxury hotel lobby design featuring contemporary Eastern elements',
    image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2023',
    category: 'Hospitality',
    location: 'Dubai, UAE',
    client: 'Four Seasons Hotels',
    tags: ['Hospitality', 'Luxury', 'Commercial', 'Eastern Aesthetics']
  },
  {
    id: 'frank_past_2',
    title: 'Private Villa Interior',
    type: 'past-project',
    designer: 'Frank Chou',
    description: 'Complete interior design for a luxury villa in Emirates Hills',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2022',
    category: 'Residential',
    location: 'Emirates Hills, Dubai',
    client: 'Private Client',
    tags: ['Residential', 'Villa', 'Luxury', 'Complete Interior']
  },

  // Atelier Oi Projects
  {
    id: 'atelier_ready_1',
    title: 'Material Poetry Collection',
    type: 'ready-design',
    designer: 'Atelier Oi',
    description: 'Experimental furniture collection exploring material boundaries',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2024',
    category: 'Living Room',
    price: 32000,
    currency: 'AED',
    features: [
      'Sculptural seating in innovative materials',
      'Experimental lighting installations',
      'Modular storage systems',
      'Interactive design elements',
      'Sustainable material sourcing'
    ],
    tags: ['Experimental', 'Sculptural', 'Innovation', 'Sustainable']
  },
  {
    id: 'atelier_past_1',
    title: 'Louis Vuitton Flagship Store',
    type: 'past-project',
    designer: 'Atelier Oi',
    description: 'Innovative retail space design for luxury fashion flagship',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2023',
    category: 'Retail',
    location: 'Geneva, Switzerland',
    client: 'Louis Vuitton',
    tags: ['Retail', 'Luxury', 'Innovation', 'Commercial']
  },
  {
    id: 'atelier_past_2',
    title: 'Museum of Contemporary Art',
    type: 'past-project',
    designer: 'Atelier Oi',
    description: 'Gallery furniture and exhibition design for contemporary art museum',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2022',
    category: 'Cultural',
    location: 'Basel, Switzerland',
    client: 'Museum of Contemporary Art',
    tags: ['Cultural', 'Exhibition', 'Contemporary', 'Public Space']
  },

  // Raw Edges Projects
  {
    id: 'raw_ready_1',
    title: 'Playful Workspace Collection',
    type: 'ready-design',
    designer: 'Raw Edges',
    description: 'Creative office furniture designed to inspire innovation',
    image: 'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2024',
    category: 'Office',
    price: 15800,
    currency: 'AED',
    features: [
      'Modular desk systems with color accents',
      'Ergonomic seating with playful forms',
      'Creative storage solutions',
      'Collaborative furniture pieces',
      'Mood-enhancing color palette'
    ],
    tags: ['Creative', 'Modular', 'Colorful', 'Collaborative']
  },
  {
    id: 'raw_ready_2',
    title: 'Color Burst Dining Set',
    type: 'ready-design',
    designer: 'Raw Edges',
    description: 'Vibrant dining collection celebrating color and form',
    image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2024',
    category: 'Dining',
    price: 22400,
    currency: 'AED',
    features: [
      'Gradient-colored dining table',
      'Mix-and-match chair collection',
      'Interactive serving pieces',
      'Customizable color options',
      'Sustainable manufacturing process'
    ],
    tags: ['Colorful', 'Interactive', 'Sustainable', 'Customizable']
  },
  {
    id: 'raw_past_1',
    title: 'Google Creative Campus',
    type: 'past-project',
    designer: 'Raw Edges',
    description: 'Innovative workspace design for tech company creative hub',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2023',
    category: 'Corporate',
    location: 'London, UK',
    client: 'Google',
    tags: ['Corporate', 'Innovation', 'Technology', 'Creative Space']
  },
  {
    id: 'raw_past_2',
    title: 'Design Museum Installation',
    type: 'past-project',
    designer: 'Raw Edges',
    description: 'Interactive furniture installation exploring design processes',
    image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    year: '2022',
    category: 'Exhibition',
    location: 'London, UK',
    client: 'Design Museum London',
    tags: ['Exhibition', 'Interactive', 'Educational', 'Process-Driven']
  }
];