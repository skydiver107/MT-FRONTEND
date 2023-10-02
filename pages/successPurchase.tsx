import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderConfirm from "@/layouts/headerConfirm";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useResize } from "@/utils/helper";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function SuccessPurchase() {
  const title: any = "Fund Wallet";
  const router = useRouter();
  const { isMobile } = useResize();

  const [newmtcAmount, setNewMtcAmount] = useState();

  const { t } = useTranslation("common");

  const dispatch = useDispatch();
  const userStore = useSelector((state: any) => state.userStore);

  const getRoleName = (role: string) => {
    switch (role) {
      case "ROLE_USER":
        return "User";
      case "ROLE_ADMIN":
        return "Admin";
      default:
        return "";
    }
  };

  useEffect(() => {
    const amount: any = sessionStorage.getItem("amount");
    const email: any = sessionStorage.getItem("email");
    setNewMtcAmount(amount);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/auth/getInfoFromEmail`,
        {
          params: {
            email,
          },
        }
      )
      .then((response) => {
        const {
          id,
          email,
          roles,
          mtcAmount,
          userAvatar,
          username,
          fullName,
          contactNumber,
          zipCode,
          city,
          state,
          usCitizen,
          gender,
          birthDate,
          address,
          createdAt,
        } = response.data;

        setStore(
          id,
          username,
          email,
          getRoleName(roles[0]),
          mtcAmount,
          userAvatar,
          fullName,
          contactNumber,
          zipCode,
          city,
          state,
          usCitizen,
          gender,
          birthDate,
          address,
          createdAt,
          dispatch
        );
      });
  }, []);

  return (
    <div>
      <HeaderConfirm title={t("fund_wallet")} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="flex justify-center">
            <Image
              src="/assets/success.gif"
              width={500}
              height={500}
              alt="GIF"
            />
          </div>
          <div>
            <div
              style={{
                color: `#070707`,
                textAlign: `center`,
                fontSize: `20px`,
                fontFamily: `Karla_Bold`,
                fontWeight: `500`,
                lineHeight: `32px`,
              }}
            >
              {t("congratulations")}
            </div>
            <div
              className="mt-2"
              style={{
                color: `#6A707C`,
                textAlign: `center`,
                fontSize: `15px`,
                fontFamily: `Karla_Bold`,
                fontWeight: `500`,
                lineHeight: `20px`,
              }}
            >
              {t("your_account_credited_with")} {newmtcAmount} MTCs
            </div>
          </div>

          <div className="bottom_button_wrapper">
            <Button
              className={isMobile ? "w-100" : "w-50 flex justify-center"}
              style={{
                background: `#1380FF`,
                borderRadius: "50px",
                color: "#FFFF",
                height: "50px",
                textTransform: "none",
                fontFamily: "Karla_Bold",
              }}
              onClick={() => router.replace("/wallet")}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
