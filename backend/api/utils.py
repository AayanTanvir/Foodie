from django.core.mail import EmailMessage


class Utils:
    @staticmethod
    def send_email(data):
        """
        send an email to the given email address
        """
        if not data:
            return None
        email = EmailMessage(subject=data['subject'], body=data['body'], to=[data['to']], from_email="k98778376@gmail.com")
        email.send()