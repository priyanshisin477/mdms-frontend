export default function Alerts({ data }) {
    return (
      <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
        <h2 className="text-lg font-semibold mb-4 text-red-400">
          ⚠️ Expiring Soon
        </h2>
  
        {data.length === 0 ? (
          <p className="text-gray-400">No alerts</p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-slate-700/40 p-3 rounded-xl hover:bg-red-500/20 transition"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    Expiry: {new Date(item.expiryDate).toDateString()}
                  </p>
                </div>
  
                <span className="text-red-400 text-sm font-semibold">
                  Expiring Soon
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }