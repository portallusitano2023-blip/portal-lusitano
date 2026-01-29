// @ts-nocheck
import { client } from "@/lib/client";
import Navbar from "@/components/Navbar";
import Newsletter from "../../components/Newsletter";
import BlogContent from "./BlogContent";

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    title,
    publishedAt,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }`);

  return (
    <>
      <Navbar />
      <BlogContent posts={posts} />
      <div className="bg-[#050505] px-6">
        <div className="max-w-4xl mx-auto pb-20 border-t border-zinc-900 pt-20">
          <Newsletter />
        </div>
      </div>
    </>
  );
}
