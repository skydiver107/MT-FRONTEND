import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// for Mui Select button
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import axios from "axios";

export default function Eligibility() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const { t } = useTranslation("eligibility");

  const handleLangChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
    router.locale = event.target.value;
    sessionStorage.setItem("language", event.target.value);

    router.push("/welcome/eligibility", "/welcome/eligibility", {
      locale: router.locale,
    });
  };

  useEffect(() => {
    sessionStorage.setItem("language", "en");
  }, []);

  return (
    <div className="background">
      <div
        className="flex"
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
        }}
      >
        <div>
          <div className="welcome_logo">
            <div style={{ marginTop: "70px" }}>
              <Image
                src="/assets/moneto_logo_large.svg"
                width={375}
                height={351}
                alt="error"
              />
            </div>
          </div>

          <div className="welcome_title" style={{ fontSize: "32px" }}>
            {t("over_18")}
          </div>
          <div className="flex justify-center">
            <div className="welcome_content">
              {t("payment_services_requires")}
            </div>
          </div>
          <div className="flex items-center justify-center mt-10">
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                {t("choose_language")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                label="Choose language"
                onChange={handleLangChange}
                sx={{
                  width: "200px",
                  height: "40px",

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="welcome_button_wrapper">
          <div
            className="welcome_button"
            onClick={() => router.push("/welcome")}
          >
            <div className="welcome_button_content"> {t("yes_18")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["eligibility"])),
  },
});
