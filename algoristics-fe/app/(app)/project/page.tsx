export const metadata = {
  title: "Home - BidBridge",
  description: "FHN-GLC",
};

import ProjectList from "@/components/project-list";

export default function Home() {
  console.warn(process.env.NEXT_PUBLIC_API);
  
  const endpoint = process.env.NEXT_PUBLIC_API
  return (
    <>
      <ProjectList endpoint={endpoint} title="Relevant Project" entity="projects" />
    </>
  );
}
