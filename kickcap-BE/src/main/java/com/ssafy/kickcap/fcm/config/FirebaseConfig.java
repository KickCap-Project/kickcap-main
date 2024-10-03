package com.ssafy.kickcap.fcm.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {
    private String firebaseSdkPath = "firebase/kickcap-ed61c-firebase-adminsdk-2xl30-ad051619d3.json";

    @PostConstruct
    public void initialize() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {

                ClassPathResource resource = new ClassPathResource(firebaseSdkPath);
                InputStream serviceAccount = resource.getInputStream();
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);

            } catch (FileNotFoundException e) {
                log.error("Firebase ServiceAccountKey FileNotFoundException" + e.getMessage());
            } catch (IOException e) {
                log.error("FirebaseOptions IOException" + e.getMessage());
            }
        }
    }
}