import HomeContent from "@/components/HomeContent";

// ISR: Revalidate homepage every hour
export const revalidate = 3600;

export default function HomePage() {
  return <HomeContent />;
}
