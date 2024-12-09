import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import RenderProjects from "./RenderProjects";
import RenderEmployees from "./RenderEmployees";

export default function UploadDashboard({ data, endpoint }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [searchProjects, setSearchProjects] = useState(null);
  const [searchEmployees, setSearchEmployees] = useState(null);
  
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
      <div className="font-bold text-lg">1. Key Features of OOG Solution:</div>
        {openDetail ? <Markdown children={data?.summary} /> : data?.summary_json?.project_summarization}
        {!openDetail && <button className="text-blue-500 ml-2 underline" onClick={() => setOpenDetail(true)}>Detail</button>}
        {openDetail && <button className="text-gray-500 ml-2 underline" onClick={() => setOpenDetail(false)}>Less</button>}
        </div>
        {test?.technology_suggestion && (<div className="pt-4 ">
            <ul className="list">
              {Object.keys(test.technology_suggestion).map(i => (
<>
{typeof test?.technology_suggestion[i] === 'string'  ? (<li><b className="uppercase">{i}:</b> {test?.technology_suggestion[i]}</li>)

: (<li><ul>
  {Object.keys(test.technology_suggestion[i]).map(j => j !== 'explain' && (
  <li className="mb-2">
    <h3><b className="capitalize">{j}</b></h3> 
     - {test.technology_suggestion[i][j]}  ({test.technology_suggestion[i].explain})
    
    </li>
))}
  </ul></li>)}
              
                </>
              ))}
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
              {data?.development_plan?.map((i, k) => (<div className="bg-blue-700 p-2 rounded flex items-center justify-center font-bold" title={i.explain}>Phase {k+1} ({i.time})</div>))}
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
              {data?.development_plan?.map(i => (<div className="grid gap-2">
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
</div>
  );
}
