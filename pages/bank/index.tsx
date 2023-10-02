import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useResize } from "@/utils/helper";
import CheckIcon from "@mui/icons-material/Check";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function PlaidIndex() {
  const title: any = "Link Bank Account";
  const router = useRouter();
  const { isMobile } = useResize();

  const { t } = useTranslation("common");

  useEffect(() => {
    sessionStorage.setItem("paymentMethod", "plaid");
  }, []);

  return (
    <div>
      <HeaderRoutes title={t("live_bank_account")} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="select_method_title flex justify-center text-center">
            {t("connect_bank_account")}
          </div>
          <div className="flex justify-center mt-16">
            <Image
              src="/assets/bank_logo.svg"
              width={500}
              height={500}
              alt="Error on plaidLogo"
            />
          </div>
          <div className="flex justify-center">
            <div className={isMobile ? "flex mt-8 w-100" : "flex mt-12 w-45"}>
              <div className="mt-0.5">
                <CheckIcon />
              </div>
              <div className="ml-2">
                <div
                  style={{
                    color: `#070707`,
                    fontSize: `20px`,
                    fontFamily: `Karla_Bold`,
                    fontWeight: `500`,
                    lineHeight: `32px`,
                  }}
                >
                  {t("secure")}
                </div>
                <div
                  className="mt-2"
                  style={{
                    color: `#6A707C`,
                    fontSize: `15px`,
                    fontFamily: `Karla_Bold`,
                    fontWeight: `500`,
                    lineHeight: `20px`,
                  }}
                >
                  {t("all_bank_communication")}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className={isMobile ? "flex mt-4 w-100" : "flex mt-4 w-45"}>
              <div className="mt-0.5">
                <CheckIcon />
              </div>
              <div className="ml-2">
                <div
                  style={{
                    color: `#070707`,
                    fontSize: `20px`,
                    fontFamily: `Karla_Bold`,
                    fontWeight: `500`,
                    lineHeight: `32px`,
                  }}
                >
                  {t("private")}
                </div>
                <div
                  className="mt-2"
                  style={{
                    color: `#6A707C`,
                    fontSize: `15px`,
                    fontFamily: `Karla_Bold`,
                    fontWeight: `500`,
                    lineHeight: `20px`,
                  }}
                >
                  {t("we_will_never_see")}
                </div>
              </div>
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
              onClick={() => router.push("/bank/addbank")}
            >
              {t("continue_with_bank_account")}
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
