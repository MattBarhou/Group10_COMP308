import { loadRemoteModule } from "federation-utils";

// This file will handle dynamic loading of micro-frontends
// Note: we'll need a federation setup to make this work

export async function loadAuthModule(moduleName) {
  return await loadRemoteModule({
    remoteEntry:
      process.env.NEXT_PUBLIC_AUTH_REMOTE_ENTRY ||
      "http://localhost:3001/remoteEntry.js",
    scope: "auth",
    module: moduleName,
  });
}

export async function loadBusinessModule(moduleName) {
  return await loadRemoteModule({
    remoteEntry:
      process.env.NEXT_PUBLIC_BUSINESS_REMOTE_ENTRY ||
      "http://localhost:3002/remoteEntry.js",
    scope: "business",
    module: moduleName,
  });
}

export async function loadCommunityModule(moduleName) {
  return await loadRemoteModule({
    remoteEntry:
      process.env.NEXT_PUBLIC_COMMUNITY_REMOTE_ENTRY ||
      "http://localhost:3003/remoteEntry.js",
    scope: "community",
    module: moduleName,
  });
}

// This is a placeholder!!!! Actual implementation will depend on our module federation setup
export function ErrorBoundary({ children, fallback }) {
  if (typeof window === "undefined") {
    return fallback || <div>Loading...</div>;
  }

  try {
    return children;
  } catch (error) {
    console.error("Error loading federated module:", error);
    return fallback || <div>Something went wrong. Please try again later.</div>;
  }
}
