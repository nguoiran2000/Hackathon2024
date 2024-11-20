"use client";

import React, { useState, useEffect, useRef } from "react";
import RenderProjects from "./RenderProjects";
import RenderEmployees from "./RenderEmployees";

export default function ProjectList({ title, entity, endpoint }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [results, setResults] = useState({});

  // Update debounced search term after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch search results whenever debounced search term changes
  useEffect(() => {
    if (debouncedSearch) {
      fetch(`${endpoint}/api/search?entity_type=${entity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query_text: debouncedSearch }),
      })
        .then(response => response.json())
        .then(data => setResults(data))
        .catch(error => console.error('Error fetching search results:', error));
    } else {
      // setResults({});
    }
  }, [debouncedSearch]);

  return (
    <>
    <section className="relative mt-24 mx-auto max-w-6xl px-4 sm:px-6 m-auto">
      <div className="w-full py-4 mb-12">

<div className="flex flex-col bg-white mt-6">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="block text-xl font-semibold text-[#07074D] p-6">{title}</div>
      <div className="">
        <div className="px-4"><input type="text" placeholder="Search" className="w-full px-4 py-2 border border-gray-300 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {entity === 'projects' && <RenderProjects data={results[entity]} />}
        {entity === 'employees' && <RenderEmployees data={results[entity]} />}
      </div>
    </div>
  </div>
</div>
        </div>
      </section>
    </>
  );
}
