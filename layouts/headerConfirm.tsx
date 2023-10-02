import Image from "next/image";
import { useRouter } from "next/router";
import { useResize } from "@/utils/helper";

const HeaderConfirm = ({ title }: any) => {
  const router = useRouter();
  const { isMobile } = useResize();
  return (
    <div className="header_logo">
      <div className="block" style={{ width: isMobile ? "90%" : "70%" }}>
        <div className="flex justify-center">
          <Image
            src="/assets/moneto_logo_small.svg"
            width={170}
            height={30}
            alt="error"
            onClick={() => router.push("/profile")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="flex text-center justify-center mt-4">
          <div className="flex items-center header_button_title">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderConfirm;
