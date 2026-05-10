import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CV from "@/pages/cv";
import Projects from "@/pages/projects";
import BlogList from "@/pages/blog";
import BlogEditor from "@/pages/blog-editor";
import BlogPost from "@/pages/blog-post";
import Connect from "@/pages/connect";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cv" component={CV} />
        <Route path="/projects" component={Projects} />
        <Route path="/blog" component={BlogList} />
        <Route path="/blog/new" component={BlogEditor} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/connect" component={Connect} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;