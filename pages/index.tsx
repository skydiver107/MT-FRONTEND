import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Home = () => {
  const router: any = useRouter();
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/profile");
    } else {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        router.push("/profile");
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <p></p>;
};

export default Home;
