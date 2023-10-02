import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Auth() {
  const router = useRouter();
  const { t } = useTranslation("eligibility");

  const trusonaSignIn = () => {
    console.log(
      "process value is",
      process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT
    );

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/auth/trusona`)
      .then((res) => {
        window.location.href = res.data.authUrl;
      });
  };

  return (
    <div className="background">
      <div className="welcome_logo">
        <div style={{ marginTop: "10px" }}>
          <Image
            src="/assets/moneto_logo_large.svg"
            width={375}
            height={351}
            alt="error"
          />
        </div>
      </div>
      <div className="signin flex justify-center">
        <div className="signin_wrapper mb-4">
          <div className="signin_title">{t("sign_or_create")}</div>

          <div className="signin_button_wrapper">
            <div className="signin_button" onClick={trusonaSignIn}>
              <div className="signin_button_content">{t("continue")}</div>
            </div>
          </div>

          <div className="terms_title">{t("by_continuing")}</div>

          <div className="trusona_title">{t("powered_by_trusona")}</div>
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
