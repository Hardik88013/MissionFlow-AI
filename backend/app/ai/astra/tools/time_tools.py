from datetime import datetime
from zoneinfo import ZoneInfo


def get_current_time() -> dict:
    now = datetime.now(ZoneInfo("Asia/Kolkata"))

    return {
        "time": now.strftime("%I:%M:%S %p"),
        "date": now.strftime("%A, %d %B %Y"),
        "timezone": "Asia/Kolkata",
        "iso": now.isoformat(),
    }
