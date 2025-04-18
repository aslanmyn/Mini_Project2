from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging
from time import time

# Set up task-specific logger
logger = logging.getLogger('tasker')

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={'max_retries': 3},
    name='notifications.send_match_notification'
)
def send_match_notification(self, user_email, vacancy_title, match_score):
    """
    Sends job match notification email with detailed logging
    """
    task_id = self.request.id
    start_time = time()
    
    logger.info(f"📨 Task {task_id} started | Email: {user_email} | Job: {vacancy_title}")
    logger.debug(f"Payload details - Score: {match_score:.2f}")

    try:
        # Prepare email
        subject = f"Job Match: {vacancy_title}"
        message = f"""Congratulations!
        Your resume matched with '{vacancy_title}'
        Match Score: {match_score:.2f}/100
        """
        
        logger.debug("Attempting to send email...")
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False
        )
        
        duration = round(time() - start_time, 2)
        logger.info(f"✅ Task {task_id} succeeded in {duration}s | Email sent to {user_email}")
        
        return {
            'status': 'success',
            'email': user_email,
            'match_score': match_score,
            'duration': duration
        }

    except ConnectionError as e:
        logger.error(f"🔌 Connection error in task {task_id}: {str(e)}")
        raise self.retry(exc=e)

    except Exception as e:
        logger.exception(f"⚠️ Unexpected error in task {task_id}")
        raise self.retry(exc=e)
