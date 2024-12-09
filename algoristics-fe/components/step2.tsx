import Image from "next/image";
import LoadingAI from "@/public/images/loading.gif";

export default function UploadDashboard() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-[#050117] mt-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="py-10">
        {/* Section header */}
        <div className="mx-auto max-w-6xl text-center md:pb-2">
          <h2 className="[&_span]:opacity-0 text-xl font-bold text-gray-200 flex flex-wrap gap-2">
            <span className="animate-[code-1_10s_infinite]">With AI-driven insights, </span> 
            <span className="animate-[code-2_10s_infinite]">BidBridge matches the most suitable team members to project needs, </span>
            <span className="animate-[code-3_10s_infinite]">ensuring skill alignment and optimizing team performance.</span>
            <span className="animate-[code-4_10s_infinite]"> It also enables users to efficiently organize and  </span>
            <span className="animate-[code-5_10s_infinite]">present project proposals, saving time 
            </span>
            <span className="animate-[code-6_10s_infinite]">and enhancing the accuracy of bid submissions.</span>
            <span className="animate-[code-7_10s_infinite]">
 By leveraging BidBridge, organizations can elevate their bidding strategies, improve collaboration, and increase their chances of securing projects in competitive markets.
  </span>
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
