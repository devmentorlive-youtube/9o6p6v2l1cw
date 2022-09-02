export default function BaseTag({ children }) {
  return (
    <div className="py-2 px-8 border-green-400 bg-green-500 text-white">
      {children}
    </div>
  );
}
