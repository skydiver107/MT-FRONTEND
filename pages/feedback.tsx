import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HeaderRoutes from "@/layouts/headerRoutes";
import { useState, useEffect } from "react";
import { useResize } from "@/utils/helper";
import TextField from "@mui/material/TextField";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Feedback() {
  const title: any = "Support";
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("feedback");
  const { isMobile } = useResize();

  const textFieldStyle = {
    "& label": {
      left: "10px",
    },
    "& legend": {
      textAlign: "left",
      marginLeft: "10px",
    },
    "& input": {
      marginLeft: "20px",
    },
  };

  const labelStyle = {
    style: { color: "black", fontFamily: "Karla_Bold" },
  };

  return (
    <div>
      <HeaderRoutes title={title} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div
            className="setting_card_wrapper mb-4"
            style={{ marginTop: "-10px" }}
          >
            <div className="flex justify-center feedback_title mt-8">
              {t("send_feedback")}
            </div>
            <div className="mt-8">
              <TextField
                label={t("email")}
                size="small"
                style={{
                  color: "#393CDC",
                  borderRadius: "30px",
                  marginTop: "10px",
                }}
                InputLabelProps={labelStyle}
                sx={textFieldStyle}
                placeholder="name@email.com"
                focused
                fullWidth
              ></TextField>
            </div>

            <div className="mt-4">
              <TextField
                label={t("date_of_birth")}
                size="small"
                style={{
                  color: "#393CDC",
                  borderRadius: "30px",
                  marginTop: "10px",
                }}
                InputLabelProps={labelStyle}
                sx={textFieldStyle}
                placeholder="x/x/xx"
                focused
                fullWidth
              ></TextField>
            </div>

            <div className="mt-4">
              <TextField
                label={t("message")}
                size="small"
                style={{
                  color: "#393CDC",
                  marginTop: "10px",
                }}
                InputLabelProps={labelStyle}
                sx={textFieldStyle}
                placeholder="Type your message..."
                focused
                fullWidth
                multiline
                rows={6}
              ></TextField>
            </div>

            <div className="flex justify-center mt-12">
              <Button
                className="w-100 transfer_button"
                style={{
                  background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                  borderRadius: "50px",
                  color: "#FFFF",
                  height: "50px",
                }}
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["feedback"])),
  },
});
