import datetime


def validate_service_health():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": {
            "status": "healthy",
            "service": "pdf-processor",
            "timestamp": datetime.datetime.utcnow().isoformat(),
        },
    }
