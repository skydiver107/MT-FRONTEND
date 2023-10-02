import Image from "next/image";
import { useRouter } from "next/router";
import { useResize } from "@/utils/helper";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const HeaderRoutes = ({ title }: any) => {
  const router = useRouter();
  const { isMobile } = useResize();

  const { t } = useTranslation(["transaction"]);

  const backRouter = (path: any) => {
    const paymentMethod = sessionStorage.getItem("paymentMethod");

    if (path == "/fundWallet" && paymentMethod == "stripe") {
      router.push("/card/selectcard");
    } else if (path == "/fundWallet" && paymentMethod == "plaid") {
      router.push("/bank/addbank");
    } else if (path == "/fundWallet" && paymentMethod == "cakepayment") {
      router.push("/wallet");
    } else if (path == "/bank/addbank") {
      router.push("/bank");
    } else if (path == "/bank") {
      router.push("/wallet");
    } else if (path == "/settings") {
      router.push("/profile");
    } else if (path == "/card/selectcard") {
      router.push("/wallet");
    } else if (path == "/selectFundType") {
      router.push("/wallet");
    } else {
      router.back();
    }
  };

  return (
    <div className="header_logo">
      {router.pathname == "/wallet" ? (
        <div className="block" style={{ width: isMobile ? "90%" : "70%" }}>
          <div className="flex justify-center">
            <div className="flex justify-center" style={{ width: "90%" }}>
              <Image
                src="/assets/moneto_logo_small.svg"
                width={170}
                height={30}
                alt="error"
                onClick={() => router.push("/profile")}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="flex" onClick={() => router.push("/notifications")}>
              <Image
                src="/assets/btnNotifications.svg"
                width={25}
                height={25}
                alt="error"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="flex text-center justify-center mt-4">
            <div className="flex items-center ml-4 header_button_title">
              {title}
            </div>
          </div>
        </div>
      ) : (
        <div className="block" style={{ width: isMobile ? "90%" : "70%" }}>
          <div className="flex justify-center">
            <div className="flex justify-center" style={{ width: "90%" }}>
              <Image
                src="/assets/moneto_logo_small.svg"
                width={170}
                height={30}
                alt="error"
                onClick={() => router.push("/profile")}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="flex" onClick={() => router.push("/notifications")}>
              <Image
                src="/assets/btnNotifications.svg"
                width={25}
                height={25}
                alt="error"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div
            className="flex text-center justify-start mt-4"
            onClick={() => backRouter(router.pathname)}
            style={{ cursor: "pointer" }}
          >
            <Image
              src="/assets/back_btn.svg"
              width={30}
              height={30}
              alt="error"
              className="header_button"
            />
            <div className="flex items-center ml-4 header_button_title">
              {title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderRoutes;
