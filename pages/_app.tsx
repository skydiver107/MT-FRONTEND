import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import "./../styles/global.scss";
import "./../styles/welcome.scss";
import "./../styles/font.scss";
import "./../styles/signin.scss";
import "./../styles/tailwind.css";
import "./../styles/profile.scss";
import "./../styles/header.scss";
import "./../styles/fund.scss";
import "./../styles/footer.scss";
import "./../styles/stripe.scss";
import "./../styles/wallet_transfer.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// for next-i18
import { appWithTranslation } from "next-i18next";

// for stripe payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useDispatch, useSelector } from "react-redux";
import { setStore, resetStore } from "@/redux/actions";

import { wrapper } from "@/redux/store";
import axios from "axios";

// cookies
import { CookiesProvider } from "react-cookie";
import { useCookies, Cookies } from "react-cookie";

const stripePromise: any = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY ? process.env.NEXT_PUBLIC_STRIPE_KEY : ""
);

const MyApp = ({ Component, pageProps }: any) => {
  const router = useRouter();
  const currentPath: any =
    typeof window !== "undefined" && window.location.href;

  const [auth, setAuth] = useState(false);
  const [cookie, setCookie] = useCookies(["moneto"]);

  const dispatch = useDispatch();
  const userStore = useSelector((state: any) => state.userStore);

  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];
  if (path) {
    router.replace(path);
  }

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
    const pathName: any = typeof window !== "undefined" && window.location.href;
    const splitToken = pathName.split("=", 2);
    const accessToken = splitToken[1];
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      router.push("/profile");
      setCookie("moneto", "signed", {
        path: "/",
        maxAge: 43200, // Expires after 12hr
        sameSite: true,
      });
    } else {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        axios
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
              setAuth(true);
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("email", email);
              sessionStorage.setItem("role", roles[0]);
              // sessionStorage.setItem("language", router.locale);

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
              if (
                router.pathname == "/auth" ||
                router.pathname == "/welcome/eligibility"
              )
                router.push("/profile");
              // else router.push("/auth");
            } else {
              sessionStorage.clear();
              resetStore(dispatch);
              // try {
              //   axios.get(
              //     `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/auth/logout?accessToken=${accessToken}`
              //   );
              //   router.push("/auth");
              // } catch (e) {
              //   router.push("/auth");
              // }

              if (router.pathname === "/auth") router.push(currentPath);
              else router.push("/auth");
            }
          });
      } else {
        const cookieValue: any = cookie.moneto;
        if (cookieValue) {
          router.push("/auth");
        } else {
          router.push("/welcome/eligibility");
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Head>
        <title>MONETO</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon.png"
        />
      </Head>
      <Elements stripe={stripePromise}>
        <CookiesProvider>
          <Component {...pageProps} />
        </CookiesProvider>
      </Elements>
      <ToastContainer />
    </div>
  );
};

export default wrapper.withRedux(appWithTranslation(MyApp));
