import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="mb-3 font-mono text-sm text-primary">ERROR 404</p>
        <h1 className="mb-3 text-4xl font-bold">Page not found</h1>
        <p className="mb-6 text-muted-foreground">The page you requested does not exist.</p>
        <Link to="/" className="inline-flex rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
