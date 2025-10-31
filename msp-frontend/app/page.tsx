import HeroSection from './components/HeroSection';
import ContentRow from './components/ContentRow';
import BottomNavigation from './components/BottomNavigation';

const continueWatchingItems = [
  { id: '1', title: 'Shadow Protocol', progress: 65, duration: '42:15' },
  { id: '2', title: 'Midnight Hearts', progress: 80, duration: '1:05:30' },
  { id: '3', title: 'The Last Stand', progress: 30, duration: '25:48' },
  { id: '4', title: 'Whispers in the Dark', progress: 90, duration: '1:15:22' },
];

const trendingItems = [
  { id: '5', title: 'Velocity Rush' },
  { id: '6', title: 'Echoes of Tomorrow' },
  { id: '7', title: 'City of Secrets' },
  { id: '8', title: 'Guardian Force' },
  { id: '9', title: 'Broken Promises' },
];

export default function Home() {
  return (
    <main className="pb-20">
      <HeroSection />
      
      <ContentRow 
        title="Continue Watching" 
        items={continueWatchingItems} 
        showProgress={true}
      />
      
      <ContentRow 
        title="Trending Now" 
        items={trendingItems} 
        showSeeAll={true}
      />
      <BottomNavigation />
    </main>
  );
}