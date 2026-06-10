
function PendingRequestsTable() {
  const requests = [
    { id: 1, name: "Gian Carlo M. Deloeste", status: "Claiming" },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-gray-600">
        {/* Table Header */}
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-4">DATE</th>
            <th scope="col" className="px-6 py-4">Name</th>
            <th scope="col" className="px-6 py-4">Status</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {requests.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
              {/* ID Column */}
              <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                {row.id}
              </td>
              
              {/* Name Column */}
              <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800">
                {row.name}
              </td>
              
              {/* Status Column with Dynamic Badge Colors */}
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                    ${row.status === 'Claiming' ? 'bg-emerald-50 text-emerald-700' : ''}
                    ${row.status === 'Pending' ? 'bg-amber-50 text-amber-700' : ''}
                    ${row.status === 'Ready' ? 'bg-blue-50 text-blue-700' : ''}
                  `}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingRequestsTable