import React, { useEffect } from "react";
import "./login.css";
import { Button, Layout, Typography } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "../../assets/GoogleIcon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Text, Title } = Typography;

function Login() {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      axios
        .post("https://chatapp-backend-5tbb.onrender.com/auth", {
          accessToken: tokenResponse.access_token,
        })
        .then((res) => {
          localStorage.setItem("jwt", res.data.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(jwtDecode(res.data.data.token))
          );

          setTimeout(() => {
            navigate("/");
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  useEffect(() => {
    if (localStorage.getItem("jwt") && localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  return (
    <Layout id="login-layout">
      <Title level={1} style={{ marginBottom: 50, fontSize: 45 }}>
        Welcome to our <span style={{ color: "#0d2234" }}>Chat App</span>
      </Title>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid #008ad3",
          borderRadius: 9,
          boxSizing: "border-box",
          cursor: "pointer",
        }}
        onClick={() => googleLogin()}
        className="button-container"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid #008ad3",
            boxSizing: "border-box",
            height: "100%",
          }}
          className="login-button-container"
        >
          <img src={GoogleIcon} alt="" className="google-sign-in-icon" />
        </div>
        <Button
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            color: "#008ad3",
            fontWeight: 549,
            textAlign: "center",
            fontFamily: "Poppins,sans-serif",
            boxSizing: "border-box",
          }}
          className="google-login-button"
        >
          Sign in with Google
        </Button>
      </div>
    </Layout>
  );
}

export default Login;
