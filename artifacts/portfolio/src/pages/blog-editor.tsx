import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateBlogPost, getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function BlogEditor() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createPost = useCreateBlogPost();
  
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    // Basic protection - should use proper routing guard
    const isAdmin = typeof window !== 'undefined' ? !!sessionStorage.getItem('adminToken') : false;
    if (!isAdmin) {
      setLocation("/blog");
    }
  }, [setLocation]);

  const handlePublish = () => {
    if (!title || !body) return;
    
    const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);
    
    // In a real app we'd convert markdown to HTML here, but for this task 
    // we'll just save the raw text/html directly.
    // Wrap paragraphs with <p> for simple line breaks if not already HTML
    const htmlBody = body.includes('<') && body.includes('>') 
      ? body 
      : body.split('\n\n').map(p => `<p>${p}</p>`).join('');

    createPost.mutate({
      data: {
        title,
        body: htmlBody,
        tags: tags.length > 0 ? tags : undefined
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        setLocation("/blog");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-display text-4xl text-[#c9a96e] font-bold uppercase tracking-widest">New Post</h1>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => setLocation("/blog")} className="text-[#9a9db0] hover:text-[#e8e6e1]">Cancel</Button>
          <Button 
            onClick={handlePublish} 
            disabled={createPost.isPending || !title || !body} 
            className="bg-[#c9a96e] text-[#111318] hover:bg-[#a8c5e0] font-display uppercase tracking-widest"
          >
            {createPost.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-transparent border-none text-4xl md:text-5xl font-display font-bold uppercase tracking-wider text-[#e8e6e1] placeholder-[#9a9db0]/30 focus:outline-none focus:ring-0"
        />
        
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-[#a8c5e0] placeholder-[#9a9db0]/50 focus:outline-none focus:ring-0 font-mono"
        />

        <div className="h-px bg-[#2a2f3d] w-full my-4" />

        <textarea
          placeholder="Write something..."
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full h-[60vh] bg-transparent border-none text-lg text-[#e8e6e1] placeholder-[#9a9db0]/30 focus:outline-none focus:ring-0 resize-none leading-relaxed"
          style={{ fontFamily: "var(--app-font-sans)" }}
        />
      </div>
    </div>
  );
}