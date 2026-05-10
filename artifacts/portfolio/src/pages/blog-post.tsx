import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetBlogPost, 
  useDeleteBlogPost, 
  useUpdateBlogPost,
  getListBlogPostsQueryKey,
  getGetBlogPostQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const isAdmin = typeof window !== 'undefined' ? !!sessionStorage.getItem('adminToken') : false;

  const { data: post, isLoading, error } = useGetBlogPost(slug || "", {
    query: {
      enabled: !!slug,
      queryKey: getGetBlogPostQueryKey(slug || "")
    }
  });

  const deletePost = useDeleteBlogPost();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-12 w-3/4 bg-[#181c24] rounded mb-6" />
        <div className="h-4 w-1/4 bg-[#181c24] rounded mb-12" />
        <div className="space-y-4">
          <div className="h-4 bg-[#181c24] rounded" />
          <div className="h-4 bg-[#181c24] rounded" />
          <div className="h-4 bg-[#181c24] rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-[#e07070] mb-4">Post Not Found</h1>
        <Button variant="link" onClick={() => setLocation("/blog")} className="text-[#9a9db0]">
          <ArrowLeft size={16} className="mr-2" /> Back to blog
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate({ slug: post.slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          setLocation("/blog");
        }
      });
    }
  };

  const date = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <>
      <div 
        className="fixed top-0 left-0 h-[2px] bg-[#c9a96e] z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-20 relative">
        <button 
          onClick={() => setLocation("/blog")}
          className="absolute left-4 md:-left-12 top-14 md:top-24 text-[#9a9db0] hover:text-[#c9a96e] transition-colors p-2"
          aria-label="Back to blog"
        >
          <ArrowLeft size={24} />
        </button>

        <header className="mb-12 text-center md:text-left pt-8 md:pt-0">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#c9a96e] font-bold uppercase tracking-wider leading-[1.1] mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-center md:justify-start gap-4 text-[#9a9db0] text-sm">
              <time className="font-mono">{date}</time>
              {post.readTimeMinutes && (
                <>
                  <span className="text-[#2a2f3d]">|</span>
                  <span>{post.readTimeMinutes} min read</span>
                </>
              )}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-[#232840] text-[#a8c5e0] rounded text-xs border border-[#2a2f3d]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="w-24 h-[1px] bg-[#c9a96e] mx-auto md:mx-0 opacity-50 mb-12" />

        {/* Global styles for this specific block to match design system requirements */}
        <div 
          className="prose prose-invert prose-lg max-w-none prose-p:leading-[1.9] prose-p:text-[#e8e6e1]/90 prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-[#e8e6e1] prose-a:text-[#7c9cbf] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-[#c9a96e] prose-blockquote:text-[#9a9db0] prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:pl-6 prose-pre:bg-[#181c24] prose-pre:border prose-pre:border-[#2a2f3d] prose-code:font-mono prose-code:text-[#a8c5e0]"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {isAdmin && (
          <div className="mt-16 pt-8 border-t border-[#2a2f3d] flex justify-end gap-4">
            <Button variant="outline" className="border-[#2a2f3d] text-[#9a9db0] hover:text-[#e8e6e1]">
              <Edit2 size={16} className="mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-[#e07070]/10 text-[#e07070] hover:bg-[#e07070]/20">
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
        )}
      </article>
    </>
  );
}