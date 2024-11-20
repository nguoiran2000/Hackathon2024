
export default function RenderProjects({ data }) {
  return (
    <table
          className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead
            className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4">Project Name</th>
              <th scope="col" className="px-6 py-4">Business Domain</th>
              <th scope="col" className="px-6 py-4">Project Manager</th>
              <th scope="col" className="px-6 py-4">Technology</th>
              <th scope="col" className="px-6 py-4">Tech Issues</th>
            </tr>
          </thead>
          <tbody>
          {(data || []).map((project, index) => (
            <tr className="border-b border-neutral-200 dark:border-white/10">
              <td className="whitespace-nowrap px-6 py-4 font-medium">{project[0]?.name}</td>
              <td className="whitespace-nowrap px-6 py-4">{project[0]?.business_domain}</td>
              <td className="whitespace-nowrap px-6 py-4"><a title="Contact" className="underline text-blue-500" href="#">{project[0]?.project_manager}</a></td>
              <td className="whitespace-nowrap px-6 py-4 flex gap-1">
              {project[0]?.technology.map(i => <i className="bg-gray-200 rounded-full px-2 py-1 text-green-900 border border-green-400">{i}</i>)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button className="btn bg-gray-200 font-bold btn-sm hover:opacity-0.5" title={project[0]?.tech_issues}>Detail</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
  );
}
