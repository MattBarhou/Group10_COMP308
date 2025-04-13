export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          © {new Date().getFullYear()} Community Engagement App. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
