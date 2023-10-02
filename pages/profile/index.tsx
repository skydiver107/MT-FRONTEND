import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import Footer from "@/layouts/footer";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";
import { useResize } from "@/utils/helper";

import { useTranslation } from "next-i18next";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Typewriter from "typewriter-effect";

export default function Profile() {
  const router = useRouter();
  const { isMobile } = useResize();
  const dispatch = useDispatch();
  const defaultAvatar = "/images/defaultAvatar.jpg";
  const [currentLang, setCurrentLang] = useState<any>("en");
  const { locale } = router;
  const { t } = useTranslation("dashboard");

  const [notifications, setNotifications] = useState("");

  const userStore = useSelector((state: any) => state.userStore);

  const formatDate = (dateTime: Date) => {
    const polishedDate = new Date(dateTime);
    const formattedDate = polishedDate.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  };

  const logout = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    sessionStorage.clear();
    resetStore(dispatch);
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/auth/logout?accessToken=${accessToken}`
    );
    router.push("/auth");
  };

  const customButtonStyle = {
    borderRadius: "50px",
    height: "55px",
    textTransform: "none",
    fontFamily: "Karla_Bold",
    justifyContent: "flex-start",
    paddingLeft: "30px",
    border: "1px solid var(--compos-light, #393CDC)",
  };

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

  useEffect(() => {
    (async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      const tempLang = sessionStorage.getItem("language");
      const userId = sessionStorage.getItem("userId");
      if (tempLang == null) {
        sessionStorage.setItem("language", "en");
      }
      router.locale = tempLang ? tempLang : "en";
      setCurrentLang(sessionStorage.getItem("language"));
      router.locale = currentLang ? currentLang : "en";

      if (accessToken) {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/auth/checkLogin?accessToken=${accessToken}`
          )
          .then((res) => {
            const { isAuthenticated } = res.data;
            if (isAuthenticated) {
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
              } = res.data;
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("email", email);
              sessionStorage.setItem("role", roles[0]);
              sessionStorage.setItem("userId", id);
              // sessionStorage.setItem("language", currentLang);

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
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/v1/customers`,
                  {
                    email: email,
                  }
                )
                .then((response) => {
                  if (response.data.success) {
                    sessionStorage.setItem(
                      "customerId",
                      response.data.data.customerId
                    ); //save customer id on session storage
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          });
      } else {
        router.push("/auth");
      }
      await getNotification();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="profile_header">
        <div className="welcome_logo">
          <div style={{ marginTop: "20px" }}>
            <Image
              src="/assets/moneto_logo_small.svg"
              width={250}
              height={30}
              alt="error"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div
            className={
              isMobile
                ? "flex justify-end mr-4 w-100"
                : "flex justify-end mr-2 w-70"
            }
            style={{ marginTop: "-30px" }}
          >
            <Image
              src="/assets/btnNotifications.svg"
              width={25}
              height={25}
              alt="error"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/notifications")}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="flex text-center justify-center mt-8"
            style={{ width: isMobile ? "90%" : "70%" }}
          >
            <div className="flex items-center ml-4 header_button_title">
              {t("dashboard")}
            </div>
          </div>

          <div className="flex items-center text-center justify-center mt-4">
            {/* <TuneOutlinedIcon sx={{ color: "white" }} /> */}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "100px" }}>
        <div className="avatar_area flex justify-center">
          <div
            style={{ position: "relative", width: "133px", height: "133px" }}
          >
            <Image
              src={
                userStore.userAvatar !== null
                  ? userStore.userAvatar
                  : defaultAvatar
              }
              fill
              alt="error"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="profile_area">
          <div className="profile_name flex justify-center mt-4">
            {userStore.fullName ? userStore.fullName : "Anonymous"}
          </div>
          <div className="profile_date flex justify-center mt-2">
            {t("joined_in")} {formatDate(userStore.createdAt)}
          </div>
          <div className="profile_data flex justify-center mt-2 pl-4 pr-4">
            {userStore.userAvatar && userStore.fullName
              ? `${t("have_logged_in")} ${userStore.email}`
              : ""}
          </div>
          <div
            className="flex justify-center mt-2 pl-4 pr-4 text-center"
            style={{ fontWeight: "bold", fontSize: "22px" }}
          >
            <div className={isMobile ? "w-90" : "w-50"}>
              {userStore.username &&
              userStore.userAvatar &&
              userStore.contactNumber ? (
                notifications ? (
                  <Typewriter
                    options={{
                      strings: `${notifications}`,
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 30,
                      delay: 80,
                    }}
                  />
                ) : (
                  <></>
                )
              ) : (
                <Typewriter
                  options={{
                    strings: `${t("need_to_fill")}`,
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 30,
                    delay: 80,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex justify-center mt-2 current_balance">
            Current Balance
          </div>
          <div className="flex justify-center mt-2">
            MTC / {userStore.mtcAmount}$
          </div>
          <div className="pl-6 pr-6 mt-4 flex justify-center">
            <div className="general_wrapper">
              <div className="profile_general">{t("general")}</div>

              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/profile/setting`)}
                  sx={customButtonStyle}
                  style={{
                    boxShadow:
                      userStore.userAvatar && userStore.fullName
                        ? ""
                        : "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div>
                    <div className="flex">
                      <InfoOutlinedIcon sx={{ color: "#4737DA" }} />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("account_profile")}
                      </div>
                    </div>
                    {userStore.userAvatar && userStore.fullName ? (
                      <div></div>
                    ) : (
                      <div className="button_warning_text flex">
                        {t("profile_warning")}
                      </div>
                    )}
                  </div>
                </Button>
              </div>
              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/settings`)}
                  sx={customButtonStyle}
                  style={{
                    opacity:
                      userStore.userAvatar && userStore.fullName ? 1 : 0.3,
                  }}
                  disabled={
                    userStore.userAvatar && userStore.fullName ? false : true
                  }
                >
                  <div>
                    <div className="flex">
                      <SettingsOutlinedIcon sx={{ color: "#4737DA" }} />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("settings")}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/feedback`)}
                  sx={customButtonStyle}
                  style={{
                    opacity:
                      userStore.userAvatar && userStore.fullName ? 1 : 0.3,
                  }}
                  disabled={
                    userStore.userAvatar && userStore.fullName ? false : true
                  }
                >
                  <div>
                    <div className="flex">
                      <FeedbackOutlinedIcon sx={{ color: "#4737DA" }} />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("send_feedback")}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/notifications`)}
                  sx={customButtonStyle}
                  style={{
                    opacity:
                      userStore.userAvatar && userStore.fullName ? 1 : 0.3,
                  }}
                  disabled={
                    userStore.userAvatar && userStore.fullName ? false : true
                  }
                >
                  <div>
                    <div className="flex">
                      <NotificationsNoneOutlinedIcon
                        sx={{ color: "#4737DA" }}
                      />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("notification")}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/privacy`)}
                  sx={customButtonStyle}
                >
                  <div>
                    <div className="flex">
                      <PrivacyTipOutlinedIcon sx={{ color: "#4737DA" }} />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("policy_privacy")}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex justify-center mt-4 w-100">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={() => router.push(`${currentLang}/terms`)}
                  sx={customButtonStyle}
                >
                  <div>
                    <div className="flex">
                      <PolicyOutlinedIcon sx={{ color: "#4737DA" }} />
                      <div className="ml-8" style={{ color: "black" }}>
                        {t("tos")}
                      </div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex justify-center mt-4 w-100 mb-4">
                <Button
                  className="btn-border w-100 profile_button"
                  onClick={logout}
                  sx={customButtonStyle}
                >
                  <div>
                    <div className="flex" style={{ color: "#F24545" }}>
                      <LogoutOutlinedIcon />
                      <div className="ml-8">{t("log_out")}</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["dashboard"])),
  },
});
