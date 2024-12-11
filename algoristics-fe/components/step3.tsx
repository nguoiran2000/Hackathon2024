import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import RenderProjects from "./RenderProjects";
import RenderEmployees from "./RenderEmployees";

export default function UploadDashboard({ data, endpoint }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [searchProjects, setSearchProjects] = useState(null);
  const [searchEmployees, setSearchEmployees] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    console.warn(data,123);
    
    if (data?.summary) {
      fetchSearchResult(data);
    }
  }, []);

  const fetchSearchResult = async (data) => {
    try {
      const response = await fetch(`${endpoint}/api/search?entity_type=both`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: data?.summary_json?.project_summarization }),
      });
      const result = await response.json();
      if (result?.projects) {
        setSearchProjects(result?.projects);
        setSearchEmployees(result?.employees);
      }
      
      
    } catch (error) {
      alert("Error fetching search");
    }
  };
  const test = data?.summary_json
  return (
    <div className="mt-24">
      <div className="p-4 rounded-lg grid grid-cols-1 divide-y gap-4 card rounded shadow p-4 bg-white">
      <div className="">
      <div className="font-bold text-lg">1. Key Features of OOG Solution:</div>{data?.summary_json?.project_summarization}
        {openDetail ? <Markdown className="prose mt-4 max-w-full" children={data?.summary} /> : null}
        {!openDetail && <button className="text-blue-500 ml-2 underline" onClick={() => setOpenDetail(true)}>Detail</button>}
        {openDetail && <button className="text-gray-500 ml-2 underline" onClick={() => setOpenDetail(false)}>Less</button>}
        </div>
        {test?.technology_suggestion && (<div className="pt-4 ">
            <ul className="list">
              
  <li className="mb-2">
    <h3><b className="capitalize">Key Technologies</b></h3> 
     - {test.technology_suggestion.key_tech?.tech}  
     <p><i>{test.technology_suggestion.key_tech?.explain}</i></p>
     <h3><b className="capitalize">Additional Technologies</b></h3> 
     - {test.technology_suggestion.other_tools?.tools}  
     <p> <i>{test.technology_suggestion.other_tools?.explain}</i></p>
    </li>
            </ul>
        </div>)}
    </div>
    {data?.development_plan && (
      <div className="mt-6">
      <div className="p-4 rounded-lg grid grid-cols-1 divide-y gap-4 card rounded shadow p-4 bg-white ">
        <div className="font-bold text-lg">2. Development Plan:</div>
        <div className="grid gap-2 text-white pt-4">
            <div className="grid gap-2" style={{'grid-template-columns': `repeat(${data?.development_plan.length +1 }, minmax(0, 1fr))`}}>
              <div className=""></div> 
              {data?.development_plan?.map((i, k) => (<div onClick={() => setShowModal({...i, phase: k+1})} className="bg-blue-700 p-2 rounded flex items-center justify-center font-bold hover:bg-blue-800 cursor-pointer" title={i.explain}>Phase {k+1} ({i.time}) <span className="ml-2 border rounded-full w-5 text-center h-5 flex items-center justify-center">&#8505;</span></div>))}
            </div>

            <div className="grid gap-2" style={{'grid-template-columns': `repeat(${data?.development_plan.length +1 }, minmax(0, 1fr))`}}>
              <div className="w-30"></div>
              {data?.development_plan?.map(i => (<div className="grid gap-1" style={{'grid-template-columns': `repeat(${i?.time.split(" ")[0] * 1}, minmax(0, 1fr))`}}>
                {(i?.time.split(" ")[0] * 1) < 10 && (
                  <>{[...Array(i?.time.split(" ")[0] * 1).keys()].map((i, k) => (
                    <div className="bg-blue-500 py-2 rounded flex items-center justify-center">M{k+1}</div>
                  ))}</>
                )}
                </div>
              ))}
            </div>
            <div className="grid gap-2" style={{'grid-template-columns': `repeat(${data?.development_plan.length +1 }, minmax(0, 1fr))`}}>
              <div className="w-30 bg-blue-700 flex items-center justify-center rounded font-bold">Core functionalities</div>
              {data?.development_plan?.map((i, k) => (<div className="grid gap-2">
                {i.feature_list.map((j) => (
                  <div className="bg-green-300 p-2 rounded flex items-center justify-center text-gray-800">{j}</div>
                ))}
                </div>
              ))}
            </div>
        </div>
          </div>
      </div>
    )}
<div className="flex flex-col bg-white mt-6">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="font-bold p-6 text-lg">3. Potential resource with project tech stack</div>
      <div className="overflow-hidden">
        <RenderEmployees data={searchEmployees} />
      </div>
    </div>
  </div>
</div>

<div className="flex flex-col mt-12 mb-24 bg-white mt-6">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="font-bold p-6 text-lg">4. Relevant Project</div>
      <div className="overflow-hidden">
        <RenderProjects data={searchProjects} />
      </div>
    </div>
  </div>
</div>

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
                    Phase {showModal?.phase} Detail
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
                      {showModal?.explain}
                  </p>
                  <h2 className="mt-2"><b>Estimation Time:</b></h2>
                    - <b>{showModal?.time}</b>
                  <h2 className="mt-2"><b>Feature List:</b></h2>
                  <ul className="list-disc pl-6">
                   {showModal?.feature_list.map(i => (<li className="mr-2" title={i}
                
              >{i},</li>))}
              </ul>
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
</div>
  );
}
