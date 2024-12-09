export const metadata = {
  title: "Home - BidBridge",
  description: "FHN-GLC",
};

import ProjectList from "@/components/project-list";

export default function Home() {
  const endpoint = process.env.NEXT_PUBLIC_API
  return (
    <>
      <ProjectList endpoint={endpoint} title="Potential resource with project tech stack" entity="employees" />
    </>
  );
}
