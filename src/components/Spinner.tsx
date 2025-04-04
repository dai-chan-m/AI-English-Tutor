export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
