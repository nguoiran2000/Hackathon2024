export const metadata = {
  title: "Home - BidBridge",
  description: "FHN-GLC",
};

import Upload from "@/components/upload-dashboard"

export default async function Home() {
  const endpoint = process.env.NEXT_PUBLIC_API
  return (
    <>
      <Upload endpoint={endpoint} />
    </>
  );
}
