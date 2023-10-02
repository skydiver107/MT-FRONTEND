import { useRouter } from "next/router";
import HeaderRoutes from "@/layouts/headerRoutes";
import { useResize } from "@/utils/helper";
import { dummyData } from "@/constants/tos";

import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Terms() {
  const router = useRouter();
  const title: any = "Terms and Conditions";
  const { t } = useTranslation(["dashboard"]);

  return (
    <div>
      <HeaderRoutes title={t("tos")} />
      <div className="flex justify-center">
        <div className="select_method_wrapper">
          <div className="select_method_title">{t("tos")}</div>
          <div className="tos_content mt-4">{dummyData}</div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["dashboard"])),
  },
});
