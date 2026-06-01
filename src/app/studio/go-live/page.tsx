import { GoLiveWizard } from "@/components/creator/go-live-wizard";

export const metadata = { title: "Go Live" };

export default function GoLivePage() {
  return (
    <div className="section-shell py-8">
      <GoLiveWizard />
    </div>
  );
}
