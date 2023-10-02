import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="group items-center cursor-pointer w-12 sm:w-20 bg-gray-400 hover:text-white">
        <div className="h-8 mb-1 animate-bounce">icon</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 tracking-widest">
        Hello Stinger
      </div>
    </div>
  );
}
