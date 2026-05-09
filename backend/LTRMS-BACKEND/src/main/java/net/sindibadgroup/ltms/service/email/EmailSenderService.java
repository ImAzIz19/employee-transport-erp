package net.sindibadgroup.ltms.service.email;

import java.io.File;

public interface EmailSenderService {
    void sendEmail(final String toEmail , final String subject, String body);
    String emailVerificationCodeTemplate(String name , String code);
    void sendEmailWithAttachment(String to, String subject, String body, File attachment);
}
