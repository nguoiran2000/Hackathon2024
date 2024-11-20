import Image from "next/image";
import LoadingAI from "@/public/images/loading.gif";

export default function UploadDashboard() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-[#050117] mt-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="py-10">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center md:pb-2">
          <h2 className="[&_span]:opacity-0 text-3xl font-bold text-gray-200 md:text-2xl flex gap-2">
            <span className="animate-[code-1_10s_infinite]">BidBridge Proposal</span> 
            <span className="animate-[code-2_10s_infinite]">helps</span>
            <span className="animate-[code-3_10s_infinite]">your teams</span>
            <span className="animate-[code-4_10s_infinite]">work</span>
            <span className="animate-[code-5_10s_infinite]">more</span>
            <span className="animate-[code-6_10s_infinite]">efficiently</span>
            <span className="animate-[code-7_10s_infinite]">together!</span>
          </h2>
        </div>
        {/* Planet */}
        <div className="pb-16 md:pb-20" data-aos="zoom-y-out">
          <Image 
                  className="rounded-full bg-gray-900 m-auto"
                  src={LoadingAI}
                  alt="Loading"
                  ></Image>
        </div>
        
      </div>
    </div>
  </section>
  );
}
