import React from "react";

export default function RenderEmployees({ data }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
    <table
          className="min-w-full text-left text-sm font-light text-surface dark:text-white">
          <thead
            className="border-b border-neutral-200 font-medium dark:border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4">User Name</th>
              <th scope="col" className="px-6 py-4">Department</th>
              <th scope="col" className="px-6 py-4">Position</th>
              <th scope="col" className="px-6 py-4">Skills</th>
              <th scope="col" className="px-6 py-4">Specializations</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((employee, index) => (
              <tr className="border-b border-neutral-200 dark:border-white/10">
              <td className="whitespace-nowrap px-6 py-4 font-medium">{employee[0]?.name} ({employee[0]?.email})</td>
              <td className="whitespace-nowrap px-6 py-4">{employee[0]?.department}</td>
              <td className="whitespace-nowrap px-6 py-4">{employee[0]?.position}</td>
              <td className="whitespace-nowrap px-6 py-4 flex flex-wrap gap-1">
              {employee[0]?.skills.map(i => (<span className="rounded-full px-2 py-1 border" title={i}
                style={ {backgroundColor: '#FEEBC8', borderColor: '#D97706'}}
              >{i}</span>))}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
              <button onClick={() => setShowModal(employee)} className="btn bg-blue-200 font-bold btn-sm" title={employee[0].overview}>Info</button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {showModal[0].name}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                      {showModal[0]?.overview}
                  </p>
                  
                  <h2><b>Experiences Matching:</b></h2>
                  - {showModal[0].experiences}
                  <h2 className="mt-2"><b>Skills:</b></h2>
                  - {showModal[0]?.skills.map(i => (<span className="mr-2" title={i}
                
              >{i},</span>))}
<h2 className="mt-2"><b>Department:</b></h2>
- {showModal[0].department}
<h2 className="mt-2"><b>Position:</b></h2>
- {showModal[0]?.position}
<h2 className="mt-2"><b>Email:</b></h2>
- <a className="text-blue-500 underline" href={`#${showModal[0]?.email}`}>{showModal[0]?.email}</a>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
        </>
  );
}
