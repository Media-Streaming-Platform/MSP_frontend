// app/page.tsx
import HeroSection from './components/HeroSection';
import ContentRow from './components/ContentRow';

export default function Home() {
  return (
    <main className="pb-20">
      <HeroSection />
      
      <ContentRow 
        title="Continue Watching" 
        category="continue-watching"
        showProgress={true}
      />
      
      <ContentRow 
        title="Trending Now" 
        category="trending"
        showSeeAll={true}
      />

      <ContentRow 
        title="Featured Videos" 
        category="featured"
        showSeeAll={true}
      />

      {/* These will show media from specific categories */}
      <ContentRow 
        title="Action Videos" 
        genre="Action"
        showSeeAll={true}
      />

      <ContentRow 
        title="Music & Audio" 
        genre="Music"
        showSeeAll={true}
      />
    </main>
  );
}