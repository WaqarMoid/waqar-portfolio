import React from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogList() {
  const { data: posts = [], isLoading } = useListBlogPosts();
  const isAdmin = typeof window !== 'undefined' ? !!sessionStorage.getItem('adminToken') : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="flex justify-between items-end mb-16 border-b border-[#2a2f3d] pb-8">
        <div>
          <h1 className="font-display text-6xl md:text-7xl text-[#c9a96e] font-bold uppercase tracking-widest mb-4">Thoughts</h1>
          <p className="text-[#9a9db0] italic font-serif text-lg">Notes, essays, and things I needed to write down.</p>
        </div>
        {isAdmin && (
          <Link href="/blog/new" className="hidden sm:block">
            <Button className="bg-[#181c24] border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10 uppercase font-display tracking-widest">
              <Plus size={16} className="mr-2" /> New Post
            </Button>
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className="sm:hidden mb-8">
          <Link href="/blog/new">
            <Button className="w-full bg-[#181c24] border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10 uppercase font-display tracking-widest">
              <Plus size={16} className="mr-2" /> New Post
            </Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-8 w-3/4 bg-[#181c24] rounded mb-4" />
              <div className="h-4 w-1/4 bg-[#181c24] rounded mb-6" />
              <div className="h-20 bg-[#181c24] rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-[#9a9db0] font-serif italic">
          <p>No writings published yet.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlogCard({ post }: { post: any }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  
  // Strip HTML tags for excerpt
  const rawText = post.body.replace(/<[^>]*>?/gm, '');
  const excerpt = rawText.length > 150 ? rawText.substring(0, 150) + '...' : rawText;

  return (
    <article className="group relative">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title}</span>
      </Link>
      
      <div className="flex items-baseline gap-4 text-sm text-[#9a9db0] mb-3">
        <time className="font-mono">{date}</time>
        {post.readTimeMinutes && (
          <>
            <span className="text-[#2a2f3d]">|</span>
            <span>{post.readTimeMinutes} min read</span>
          </>
        )}
      </div>
      
      <h2 className="font-display text-3xl md:text-4xl text-[#e8e6e1] font-bold uppercase tracking-wider mb-4 group-hover:text-[#c9a96e] transition-colors leading-tight">
        {post.title}
      </h2>
      
      <p className="text-[#9a9db0] leading-relaxed mb-6">
        {excerpt}
      </p>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 relative z-20">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-[#232840] text-[#a8c5e0] rounded text-xs border border-[#2a2f3d]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}