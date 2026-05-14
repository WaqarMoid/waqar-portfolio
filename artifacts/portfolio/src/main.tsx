import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// The API is now hosted locally on Vercel via Serverless Functions!
setBaseUrl("");
