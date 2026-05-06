export default function StatCard({ title, value }) {
  return (
    <div className="
      bg-slate-800/60 
      backdrop-blur-lg 
      p-6 
      rounded-2xl 
      transition-all duration-300
      hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
      border border-blue-500/20 hover:border-blue-400
      hover:scale-105
    ">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}