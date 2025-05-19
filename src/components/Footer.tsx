const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10 py-6 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} WasteAI. Built for a greener future 🌱
        </p>
        <p className="mt-2">
          Designed with ❤️ | <a href="https://recycleye.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">Recycleye</a> & <a href="https://recyclopedia.sg" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">Recyclopedia.sg</a> inspired
        </p>
      </div>
    </footer>
  );
};

export default Footer;
