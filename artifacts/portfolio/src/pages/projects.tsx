import React, { useState } from "react";
import { 
  useListProjects, 
  useCreateProject, 
  useDeleteProject, 
  useVerifyProjectPassword,
  getListProjectsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, FileText, File, Download, X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Projects() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const isAdmin = typeof window !== 'undefined' ? !!sessionStorage.getItem('adminToken') : false;

  const { data: projects = [], isLoading } = useListProjects();
  const deleteProject = useDeleteProject();

  const filteredProjects = projects.filter(p => {
    if (filter !== "All" && p.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.join(" ").toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categories = ["All", "Presentation", "Research Paper", "Report", "Essay", "Case Study", "Other"];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex justify-between items-end mb-12 border-b border-[#2a2f3d] pb-6">
        <div>
          <h1 className="font-display text-5xl md:text-6xl text-[#c9a96e] font-bold uppercase tracking-widest mb-2">Creative Work</h1>
          <p className="text-[#9a9db0] italic">Presentations, papers, reports, and projects.</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-[#181c24] border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10 uppercase font-display tracking-widest"
          >
            <Plus size={16} className="mr-2" /> Upload Project
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-2 flex-grow">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filter === cat 
                  ? "bg-[#c9a96e] text-[#111318] border-[#c9a96e]" 
                  : "bg-[#181c24] text-[#9a9db0] border-[#2a2f3d] hover:border-[#7c9cbf]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64">
          <Input 
            placeholder="Search projects..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#181c24] border-[#2a2f3d] text-[#e8e6e1] focus-visible:ring-[#c9a96e]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-[#181c24] border border-[#2a2f3d] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-[#9a9db0]">
          <FolderOpenIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <p>Nothing here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} isAdmin={isAdmin} onDelete={() => handleDelete(project.id)} />
          ))}
        </div>
      )}

      {showUpload && <UploadModal open={showUpload} onOpenChange={setShowUpload} />}
    </div>
  );
}

function FolderOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function ProjectCard({ project, isAdmin, onDelete }: { project: any, isAdmin: boolean, onDelete: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const verifyPassword = useVerifyProjectPassword();

  const getIcon = (type?: string | null) => {
    switch(type?.toLowerCase()) {
      case 'pdf': return <FileText size={24} className="text-[#e07070]" />;
      case 'pptx':
      case 'ppt': return <FileText size={24} className="text-[#c9906e]" />;
      case 'docx':
      case 'doc': return <FileText size={24} className="text-[#7c9cbf]" />;
      default: return <File size={24} className="text-[#9a9db0]" />;
    }
  };

  const handleOpen = () => {
    if (project.isProtected) {
      setShowPassword(true);
    } else {
      window.open(project.fileUrl, '_blank');
    }
  };

  const handlePasswordSubmit = () => {
    verifyPassword.mutate({ id: project.id, data: { password } }, {
      onSuccess: (res) => {
        if (res.valid) {
          window.open(project.fileUrl, '_blank');
          setShowPassword(false);
          setPassword("");
          setError("");
        } else {
          setError("Incorrect password");
        }
      }
    });
  };

  const date = new Date(project.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="flex flex-col bg-[#181c24] border border-[#2a2f3d] rounded-lg p-6 group hover:border-[#c9a96e]/50 transition-colors relative">
      {isAdmin && (
        <button onClick={onDelete} className="absolute top-4 right-4 text-[#9a9db0] hover:text-[#e07070] opacity-0 group-hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
      
      <div className="flex items-start justify-between mb-4">
        {getIcon(project.fileType)}
        {project.isProtected && <Lock size={16} className="text-[#9a9db0]" />}
      </div>
      
      <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-[#e8e6e1] mb-2 line-clamp-2">
        {project.title}
      </h3>
      
      {project.description && (
        <p className="text-[#9a9db0] text-sm mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        {project.category && (
          <span className="px-2 py-0.5 bg-[#1e2330] border border-[#2a2f3d] text-[#c9a96e] rounded text-xs uppercase tracking-wider">
            {project.category}
          </span>
        )}
        {project.tags?.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-[#232840] text-[#a8c5e0] rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2a2f3d]">
        <span className="text-[#9a9db0] text-xs font-mono">{date}</span>
        <div className="flex gap-2">
          <button onClick={handleOpen} className="text-sm text-[#7c9cbf] hover:text-[#c9a96e] transition-colors">
            Open
          </button>
          {!project.isProtected && (
            <a href={project.fileUrl} download className="text-[#9a9db0] hover:text-[#e8e6e1] transition-colors">
              <Download size={16} />
            </a>
          )}
        </div>
      </div>

      <Dialog open={showPassword} onOpenChange={setShowPassword}>
        <DialogContent className="bg-[#181c24] border-[#2a2f3d] text-[#e8e6e1]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-widest text-[#c9a96e]">PASSWORD REQUIRED</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1] focus-visible:ring-[#c9a96e]"
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {error && <p className="text-[#e07070] text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowPassword(false)} className="text-[#9a9db0] hover:text-[#e8e6e1]">Cancel</Button>
            <Button onClick={handlePasswordSubmit} disabled={verifyPassword.isPending} className="bg-[#c9a96e] text-[#111318] hover:bg-[#a8c5e0]">
              {verifyPassword.isPending ? "Verifying..." : "Open"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const createProject = useCreateProject();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Presentation",
    tags: "",
    password: ""
  });
  
  const [isProtected, setIsProtected] = useState(false);

  const resolveUploadUrl = () => {
    return "/api/projects/upload";
  };

  const uploadToApi = async (file: File) => {
    const payload = new FormData();
    payload.append("file", file);

    const headers = new Headers();
    const adminToken = typeof window !== "undefined" ? sessionStorage.getItem("adminToken") : null;
    if (adminToken) {
      headers.set("x-admin-token", adminToken);
    }

    const response = await fetch(resolveUploadUrl(), {
      method: "POST",
      headers,
      body: payload,
    });

    if (!response.ok) {
        let message = "";
        try {
          const data = await response.json();
          message = data.error || data.message;
        } catch {
          message = await response.text();
        }
    }

    return (await response.json()) as {
      fileUrl: string;
      fileName?: string | null;
      fileType?: string | null;
    };
  };

  const handleSubmit = async () => {
    if (!formData.title) return;
    if (!uploadFile) {
      setUploadError("Select a file to upload.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const uploadResult = await uploadToApi(uploadFile);
      await createProject.mutateAsync({
        data: {
          ...formData,
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName ?? uploadFile.name,
          fileType: uploadResult.fileType ?? uploadFile.name.split(".").pop() ?? "",
          password: isProtected ? formData.password : undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#181c24] border-[#2a2f3d] text-[#e8e6e1]">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-[#c9a96e] uppercase">Upload Project</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4 md:col-span-2">
            <Input 
              placeholder="Title *" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1]"
            />
            <div className="relative">
              <Textarea 
                placeholder="Description" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value.slice(0, 300)})}
                className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1] resize-none h-24"
              />
              <span className="absolute bottom-2 right-2 text-xs text-[#9a9db0]">
                {formData.description.length}/300
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full h-10 px-3 rounded-md bg-[#111318] border border-[#2a2f3d] text-[#e8e6e1] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
            >
              {["Presentation", "Research Paper", "Report", "Essay", "Case Study", "Other"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Input 
              placeholder="Tags (comma separated)" 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1]"
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-[#9a9db0] file:mr-3 file:rounded-md file:border file:border-[#2a2f3d] file:bg-[#111318] file:px-3 file:py-2 file:text-[#e8e6e1] hover:file:border-[#c9a96e]"
              />
              <p className="text-xs text-[#9a9db0]">
                Allowed: pdf, doc, docx, ppt, pptx, mp4. Max 100 MB.
              </p>
              {uploadFile && (
                <p className="text-xs text-[#a8c5e0]">Selected: {uploadFile.name}</p>
              )}
              {uploadError && (
                <p className="text-xs text-[#e07070]">{uploadError}</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 pt-2 border-t border-[#2a2f3d]">
            <label className="flex items-center gap-2 text-sm text-[#e8e6e1] mb-2 cursor-pointer w-max">
              <input 
                type="checkbox" 
                checked={isProtected}
                onChange={e => setIsProtected(e.target.checked)}
                className="rounded border-[#2a2f3d] text-[#c9a96e] focus:ring-[#c9a96e] bg-[#111318]"
              />
              Password Protect
            </label>
            {isProtected && (
              <Input 
                type="password"
                placeholder="Set password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1]"
              />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#9a9db0] hover:text-[#e8e6e1]">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isUploading || createProject.isPending || !formData.title} className="bg-[#c9a96e] text-[#111318] hover:bg-[#a8c5e0]">
            {isUploading || createProject.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}