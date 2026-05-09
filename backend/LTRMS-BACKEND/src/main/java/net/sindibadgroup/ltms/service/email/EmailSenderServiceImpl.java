package net.sindibadgroup.ltms.service.email;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jetbrains.annotations.Contract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;


@Service
public class EmailSenderServiceImpl  implements  EmailSenderService {

    private final static Logger LOGGER = LoggerFactory
            .getLogger(EmailSenderServiceImpl.class);

    private final JavaMailSender javaMailSender;

    public EmailSenderServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }


    @Override
    @Async
    public void sendEmail(final String toEmail, final String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(body, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setFrom("ltrms@support.com");
            javaMailSender.send(mimeMessage);
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String body, File attachment) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            helper.setFrom("ltrms@support.com");
            helper.addAttachment(attachment.getName(), attachment);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with attachment", e);
        }
    }

    @Contract(pure = true)
    @Override
    public String emailVerificationCodeTemplate(String name, String code) {
        return "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0;\">\n" +
                "    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\">\n" +
                "        <div style=\"background-color: #007bff; color: #fff; text-align: center; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;\">\n" +
                "            <h2>Email Verification</h2>\n" +
                "        </div>\n" +
                "        <div style=\"padding: 20px;\">\n" +
                "            <p>Dear " + name + ",</p>\n" +
                "            <p >Activation code: <p style=\"font-weight: bold;\" >" + code + "</p></p>" +
                "        </div>\n" +
                "        <div style=\"text-align: center; padding-top: 20px;\">\n" +
                "            <p>Best regards,<br>LTRMS</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>";
    }
}

