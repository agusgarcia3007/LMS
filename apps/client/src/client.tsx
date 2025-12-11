import { StartClient } from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";
import "./i18n";
import "./index.css";

hydrateRoot(document, <StartClient />);
