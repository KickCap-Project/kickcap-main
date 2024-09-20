document.getElementById("loginButton").addEventListener("click", function() {
    fetch("/kickcap/member/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Fcm-Token": "dummy_fcm_token_value"  // 여기서 FCM 토큰 값을 설정합니다.
        },
        body: JSON.stringify({
            fcmToken: "dummy_fcm_token_value"
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken && data.refreshToken) {
                console.log("Login successful!");
                console.log("Access Token:", data.accessToken);
                console.log("Refresh Token:", data.refreshToken);
                // 토큰을 저장하여 로그아웃 시 사용할 수 있습니다.
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
            } else {
                console.error("Login failed");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.getElementById("logoutButton").addEventListener("click", function() {
    const fcmToken = "dummy_fcm_token_value";  // 여기서 저장된 FCM 토큰 값을 사용합니다.

    fetch("/kickcap/member/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({
            fcmToken: fcmToken
        })
    })
        .then(response => {
            if (response.ok) {
                console.log("Logout successful");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            } else {
                console.error("Logout failed");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
