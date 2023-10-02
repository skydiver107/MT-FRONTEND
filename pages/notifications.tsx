import { useRouter } from "next/router";
import { useResize } from "@/utils/helper";
import Image from "next/image";
import { Divider } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Privacy() {
  const { isMobile } = useResize();
  const router = useRouter();
  const title: any = "Notifications";
  const { t } = useTranslation("notifications");
  const [notifications, setNotifications] = useState("");

  const getNotification = async () => {
    const userId = sessionStorage.getItem("userId");

    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/getNotification`, {
        userId: userId,
      })
      .then((response: any) => {
        if (response.data.success) {
          setNotifications(response.data.notifications.notification);
        }
      })
      .catch((e) => {
        console.log(e);
        setNotifications("");
      });
  };

  const clearNotifications = () => {
    setNotifications("");
  };

  useEffect(() => {
    (async () => {
      await getNotification();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="header_logo">
        <div className="block" style={{ width: isMobile ? "90%" : "70%" }}>
          <div className="flex justify-center">
            <Image
              src="/assets/moneto_logo_small.svg"
              width={170}
              height={30}
              alt="error"
              onClick={() => router.push("/profile")}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="flex justify-between">
            <div
              className="flex text-center justify-start mt-4"
              onClick={() =>
                window.history.state ? router.back() : router.push("/profile")
              }
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
                {t("notifications")}
              </div>
            </div>
            <div
              className="flex header_button_title"
              style={{ fontSize: "15px", cursor: "pointer" }}
              onClick={clearNotifications}
            >
              {t("clear")}
            </div>
          </div>
        </div>
      </div>
      {notifications ? (
        <div style={{ cursor: "pointer" }}>
          <div className="flex justify-center">
            <div className="select_method_wrapper">
              <div>
                <div className="flex notification_wrapper">
                  <div className="flex">
                    <Image
                      src="/assets/notification_new.svg"
                      width={40}
                      height={40}
                      alt="error"
                    />
                    <div className="block ml-4">
                      <div className="notification_title">
                        {t("notifications")}
                      </div>
                      <div className="notification_content mt-1">
                        {notifications}
                      </div>
                    </div>
                  </div>

                  <div className="notification_time ml-4">5h ago</div>
                </div>
              </div>
            </div>
          </div>
          <Divider />
        </div>
      ) : (
        <></>
      )}

      {/* <div style={{ cursor: "pointer" }}>
        <div className="flex justify-center">
          <div className="select_method_wrapper">
            <div>
              <div className="flex notification_wrapper">
                <div className="flex">
                  <Image
                    src="/assets/notification_new.svg"
                    width={40}
                    height={40}
                    alt="error"
                  />
                  <div className="block ml-4">
                    <div className="notification_title">Notifications</div>
                    <div className="notification_content mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do...
                    </div>
                  </div>
                </div>

                <div className="notification_time ml-4">5h ago</div>
              </div>
            </div>
          </div>
        </div>
        <Divider />
      </div>

      <div style={{ cursor: "pointer" }}>
        <div className="flex justify-center">
          <div className="select_method_wrapper">
            <div>
              <div className="flex notification_wrapper">
                <div className="flex">
                  <Image
                    src="/assets/notification_read.svg"
                    width={40}
                    height={40}
                    alt="error"
                  />
                  <div className="block ml-4">
                    <div className="notification_title">Notifications</div>
                    <div className="notification_content mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do...
                    </div>
                  </div>
                </div>

                <div className="notification_time ml-4">5h ago</div>
              </div>
            </div>
          </div>
        </div>
        <Divider />
      </div> */}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["notifications"])),
  },
});
