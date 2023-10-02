import Image from "next/image";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Welcome() {
  const router = useRouter();

  const { t } = useTranslation("eligibility");

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

          <div className="welcome_title">{t("welcome")}</div>
          <div className="flex justify-center">
            <div className="welcome_content">{t("leading_the_future")}</div>
          </div>
        </div>

        <div className="welcome_button_wrapper">
          <div
            className="welcome_button"
            onClick={() => router.push("/welcome/onboarding")}
          >
            <div className="welcome_button_content">{t("next_btn")}</div>
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
