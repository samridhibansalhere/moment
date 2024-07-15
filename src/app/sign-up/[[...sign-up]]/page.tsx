import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-3 h-screen">
      <div className="bg-primary lg:col-span-2 hidden lg:flex lg:items-center lg:justify-center p-8">
        <div className="text-white">
          <h1 className="font-bold text-5xl mb-4">Moment: Where Life Unfolds</h1>
          <p className="text-base">
            Step into a world where every fleeting moment is treasured and shared.
            Moment is more than just a social platform—it's your personal gallery of life's most precious snapshots.
            Whether it's a quiet sunrise, a bustling cityscape, or cherished milestones with loved ones,
            Moment captures the essence of every experience with elegance and grace.
            Join a community where every click tells a story, and every glance reveals a new perspective.
            Explore, connect, and immerse yourself in the beauty of life's endless moments, curated just for you.
          </p>
        </div>
      </div>
      <div className="bg-primary lg:col-span-1 flex items-center justify-center p-8">
        <SignUp />
      </div>
    </div>
  );
}
