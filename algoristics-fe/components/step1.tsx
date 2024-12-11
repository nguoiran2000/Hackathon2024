import { useState } from "react";
import useLocalStorageState from 'use-local-storage-state'

export default function Step1({ onChangeStep, endpoint }) {
  const [file, setFile] = useState<File | null>(null);
  const [process, setProcess] = useState<number>(0);
  const [fileData, setFileData] = useLocalStorageState('fileData', {})

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setProcess(0);

      const interval = setInterval(() => {
        setProcess((prevProcess) => {
          if (prevProcess >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProcess + 10;
        });
      }, 100);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    
    onChangeStep(2)
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${endpoint}/summarize`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const temp = await response.json()
        setFileData(temp)
        onChangeStep(3, temp);
      } else {
        alert("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file!");
    }
  };
  return (
  <div className="flex items-center justify-center p-12 mt-12">
  <div className="mx-auto w-full max-w-[550px] bg-white">
    <form
      className="py-6 px-9"
      onSubmit={handleSubmit}
    >
      <div className="mb-6 pt-4">
        <label className="mb-5 block text-xl font-semibold text-[#07074D]">
          Upload Document
        </label>

        <div className="mb-8">
          <input type="file" name="file" id="file" className="sr-only" onChange={handleFileChange} />
          <label
            htmlFor="file"
            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
          >
            <div>
              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                Drop files here
              </span>
              <span className="mb-2 block text-base font-medium text-[#6B7280]">
                Or
              </span>
              <span
                className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]"
              >
                Browse
              </span>
            </div>
          </label>
        </div>

      {file && (
        <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
        <div className="flex items-center justify-between">
          <span className="truncate pr-3 text-base font-medium text-[#07074D]">
            {file.name}
          </span>
          <button className="text-[#07074D]" onClick={() => setFile(null)}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        {process !== 100 && (<div className="relative mt-5 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
          <div
            className="absolute progress-bar left-0 right-0 h-full rounded-lg bg-[#6A64F1]"
            style={{ width: `${process}%` }}
          ></div>
        </div>)}
      </div>
      )}
        
      </div>

      <div>
        <button
        type="submit"
          className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
        >
          Send File
        </button>
      </div>
    </form>
  </div>
</div>
  
  );
}
