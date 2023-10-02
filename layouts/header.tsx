import Image from "next/image";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <div className="header_logo">
      <Image
        src="/assets/moneto_logo_small.svg"
        width={170}
        height={30}
        alt="error"
        onClick={() => router.push("/profile")}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default Header;
