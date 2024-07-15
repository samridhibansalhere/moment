import Timeline from "./_components/timeline";
import TimelineHeader from "./_components/timeline-header";

export default async function Home() {
  return (
    <div className="grid lg:grid-cols-4 mb-5">
      <div className="col-span-2">
        <TimelineHeader />
        <Timeline />
      </div>
    </div>
  );
}