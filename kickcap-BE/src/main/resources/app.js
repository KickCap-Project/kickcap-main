
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
