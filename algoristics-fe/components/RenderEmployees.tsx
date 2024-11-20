
export default function RenderEmployees({ data }) {
  return (
    <table
          className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead
            className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4">User Name</th>
              <th scope="col" className="px-6 py-4">Department</th>
              <th scope="col" className="px-6 py-4">Position</th>
              <th scope="col" className="px-6 py-4">Skills</th>
              <th scope="col" className="px-6 py-4">Experiences Matching</th>
              <th scope="col" className="px-6 py-4">Specializations</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((employee, index) => (
              <tr className="border-b border-neutral-200 dark:border-white/10">
              <td className="whitespace-nowrap px-6 py-4 font-medium">{employee[0]?.name} ({employee[0]?.email})</td>
              <td className="whitespace-nowrap px-6 py-4">{employee[0]?.department}</td>
              <td className="whitespace-nowrap px-6 py-4">{employee[0]?.position}</td>
              <td className="whitespace-nowrap px-6 py-4  flex gap-1">
              {employee[0]?.skills.map(i => (<span className="rounded-full px-2 py-1 border" title={i}
                style={ {backgroundColor: '#FEEBC8', borderColor: '#D97706'}}
              >{i}</span>))}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{employee[0]?.experiences} years
              </td>
              <td className="whitespace-nowrap px-6 py-4">
              <button className="btn bg-gray-200 font-bold btn-sm" title={employee[0].overview}>Detail</button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
  );
}
