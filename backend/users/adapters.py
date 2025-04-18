from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        # Change the confirmation URL to your frontend
        return settings.ACCOUNT_EMAIL_CONFIRMATION_URL.format(key=emailconfirmation.key)

    def send_mail(self, template_prefix, email, context):
        # Modify the reset URL in the context before sending
        if 'password_reset_url' in context:
            # The original URL is like: http://domain/reset/MQ/set-password/
            # Get just the important parts (uid and token)
            url_parts = context['password_reset_url'].split('/')
            uid = url_parts[-3]
            token = url_parts[-2]
            
            # Create frontend URL
            context['password_reset_url'] = f"{settings.FRONTEND_URL}/{settings.PASSWORD_RESET_CONFIRM_URL.format(uid=uid, token=token)}"
        
        return super().send_mail(template_prefix, email, context)