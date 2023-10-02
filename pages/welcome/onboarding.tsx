import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";

import "swiper/css";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

import { useResize } from "@/utils/helper";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Onboarding() {
  const router = useRouter();
  const { t } = useTranslation("eligibility");
  const { isResponsive } = useResize();

  const swiperRef = useRef<SwiperType>();

  return (
    <div className="flex justify-center">
      <div className={isResponsive ? "w-100" : "w-80"}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          scrollbar={{ draggable: true }}
          pagination={{
            clickable: true,
          }}
          // navigation
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          <SwiperSlide>
            <div>
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
                    <div style={{ marginTop: "200px" }}>
                      <Image
                        src="/assets/createAccount.svg"
                        width={215}
                        height={214}
                        alt="error"
                      />
                    </div>
                  </div>

                  <div className="page_title mt-8">{t("create_account")}</div>
                  <div className="flex justify-center">
                    <div className="page_content">{t("opening_moneto")}</div>
                  </div>
                </div>

                <div className="welcome_button_wrapper mb-12">
                  <div className="flex justify-center" style={{ width: "80%" }}>
                    <div
                      className="welcome_button"
                      style={{
                        background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                        marginBottom: "0px",
                      }}
                      onClick={() => swiperRef.current?.slideNext()}
                    >
                      <div className="welcome_button_content">{t("next")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
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
                  <div style={{ marginTop: "200px" }}>
                    <Image
                      src="/assets/fundWallet.svg"
                      width={215}
                      height={214}
                      alt="error"
                    />
                  </div>
                </div>

                <div className="page_title mt-8">{t("fund_wallet")}</div>
                <div className="flex justify-center">
                  <div className="page_content">
                    {t("your_moneto_wallet_second")}
                  </div>
                </div>
              </div>

              <div className="welcome_button_wrapper mb-12">
                <div className="flex justify-center" style={{ width: "80%" }}>
                  <div
                    className="welcome_button mb-0"
                    style={{
                      background: "#CBCFD3",
                    }}
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    <div className="welcome_button_content">{t("prev")}</div>
                  </div>

                  <div
                    className="welcome_button ml-8 mb-0"
                    style={{
                      background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                    }}
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    <div className="welcome_button_content">{t("next")}</div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
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
                  <div style={{ marginTop: "200px" }}>
                    <Image
                      src="/assets/spend.svg"
                      width={215}
                      height={214}
                      alt="error"
                    />
                  </div>
                </div>

                <div className="page_title mt-8">{t("spend")}</div>
                <div className="flex justify-center">
                  <div className="page_content">
                    {t("your_moneto_wallet_third")}
                  </div>
                </div>
              </div>

              <div className="welcome_button_wrapper mb-12">
                <div className="flex justify-center" style={{ width: "80%" }}>
                  <div
                    className="welcome_button mb-0"
                    style={{
                      background: "#CBCFD3",
                    }}
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    <div className="welcome_button_content">{t("prev")}</div>
                  </div>

                  <div
                    className="welcome_button ml-8 mb-0"
                    style={{
                      background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                    }}
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    <div className="welcome_button_content">{t("next")}</div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
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
                  <div style={{ marginTop: "200px" }}>
                    <Image
                      src="/assets/withdraw.svg"
                      width={215}
                      height={214}
                      alt="error"
                    />
                  </div>
                </div>

                <div className="page_title mt-8">{t("withdraw")}</div>
                <div className="flex justify-center">
                  <div className="page_content">
                    {t("your_moneto_wallet_fourth")}
                  </div>
                </div>
              </div>

              <div className="welcome_button_wrapper mb-12">
                <div className="flex justify-center" style={{ width: "80%" }}>
                  <div
                    className="welcome_button mb-8 flex justify-center"
                    onClick={() => router.push("/auth")}
                    style={{
                      background: `var(--degradado-1, linear-gradient(320deg, #5C52B3 0%, #4478D0 58.85%, #1EB4FF 100%))`,
                      marginBottom: "0px",
                    }}
                  >
                    <div className="welcome_button_content">
                      {t("get_started")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["eligibility"])),
  },
});
