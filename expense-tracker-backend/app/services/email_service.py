from __future__ import annotations

import smtplib
from email.message import EmailMessage

from app.config import get_settings


class EmailService:
    def send_email(self, *, to_email: str, subject: str, body: str) -> bool:
        settings = get_settings()
        if not settings.email_notifications_enabled:
            return False
        if not settings.smtp_host or not settings.smtp_port or not settings.smtp_from_email:
            return False

        message = EmailMessage()
        message["From"] = settings.smtp_from_email
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_username and settings.smtp_password:
                smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)
        return True
